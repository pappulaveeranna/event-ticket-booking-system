package com.event.controller;

import com.event.model.Event;
import com.event.model.Ticket;
import com.event.model.User;
import com.event.repository.EventRepository;
import com.event.repository.TicketRepository;
import com.event.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Total counts
        long totalEvents = eventRepository.count();
        long totalUsers = userRepository.count();
        long totalTickets = ticketRepository.count();
        long validatedTickets = ticketRepository.countByValidatedTrue();
        
        // Revenue calculation
        double totalRevenue = ticketRepository.findAll().stream()
            .mapToDouble(ticket -> {
                Event event = eventRepository.findById(ticket.getEventId()).orElse(null);
                return event != null ? event.getPrice() * ticket.getNumberOfSeats() : 0;
            })
            .sum();
        
        // Recent events
        List<Event> recentEvents = eventRepository.findTop5ByOrderByIdDesc();
        
        // Popular events (most booked)
        List<Object[]> popularEvents = ticketRepository.findMostBookedEvents();
        
        stats.put("totalEvents", totalEvents);
        stats.put("totalUsers", totalUsers);
        stats.put("totalTickets", totalTickets);
        stats.put("validatedTickets", validatedTickets);
        stats.put("totalRevenue", totalRevenue);
        stats.put("recentEvents", recentEvents);
        stats.put("popularEvents", popularEvents);
        
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    @GetMapping("/tickets/all")
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }
    
    @GetMapping("/tickets/validated")
    public List<Ticket> getValidatedTickets() {
        return ticketRepository.findByValidatedTrue();
    }
    
    @GetMapping("/tickets/pending")
    public List<Ticket> getPendingTickets() {
        return ticketRepository.findByValidatedFalse();
    }
    
    @GetMapping("/events/stats/{eventId}")
    public ResponseEntity<Map<String, Object>> getEventStats(@PathVariable Long eventId) {
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null) {
            return ResponseEntity.notFound().build();
        }
        
        List<Ticket> eventTickets = ticketRepository.findByEventId(eventId);
        long validatedCount = eventTickets.stream().mapToLong(t -> t.isValidated() ? 1 : 0).sum();
        double revenue = eventTickets.stream()
            .mapToDouble(ticket -> ticket.getNumberOfSeats() * event.getPrice())
            .sum();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("event", event);
        stats.put("totalBookings", eventTickets.size());
        stats.put("validatedTickets", validatedCount);
        stats.put("pendingValidation", eventTickets.size() - validatedCount);
        stats.put("revenue", revenue);
        stats.put("tickets", eventTickets);
        
        return ResponseEntity.ok(stats);
    }
    
    @PostMapping("/users/{userId}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            String roleStr = request.get("role");
            User.Role role = User.Role.valueOf(roleStr.toUpperCase());
            user.setRole(role);
            userRepository.save(user);
            
            return ResponseEntity.ok(Map.of("message", "User role updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Delete user's tickets first
            ticketRepository.deleteByUserEmail(user.getEmail());
            userRepository.delete(user);
            
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}