package com.event.controller;

import com.event.model.Ticket;
import com.event.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:3000")
public class TicketController {
    
    @Autowired
    private TicketService ticketService;
    
    @PostMapping("/book")
    public ResponseEntity<?> bookTicket(@RequestBody Map<String, Object> request, Authentication auth) {
        try {
            Long eventId = Long.valueOf(request.get("eventId").toString());
            String userEmail = auth.getName();
            
            // Get number of seats from request, default to 1 if not provided
            int numberOfSeats = 1;
            if (request.containsKey("numberOfSeats")) {
                numberOfSeats = Integer.valueOf(request.get("numberOfSeats").toString());
            }
            
            Ticket ticket = ticketService.bookTicket(eventId, userEmail, numberOfSeats);
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/validate")
    public ResponseEntity<?> validateTicket(@RequestBody Map<String, String> request) {
        try {
            String qrCode = request.get("qrCode");
            Map<String, Object> result = ticketService.validateTicket(qrCode);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/my-tickets")
    public List<Ticket> getMyTickets(Authentication auth) {
        return ticketService.getUserTickets(auth.getName());
    }
    
    @GetMapping("/event/{eventId}")
    public List<Ticket> getEventTickets(@PathVariable Long eventId) {
        return ticketService.getEventTickets(eventId);
    }
    
    @DeleteMapping("/cancel/{ticketId}")
    public ResponseEntity<?> cancelTicket(@PathVariable Long ticketId, Authentication auth) {
        try {
            boolean cancelled = ticketService.cancelTicket(ticketId, auth.getName());
            
            if (cancelled) {
                return ResponseEntity.ok(Map.of("message", "Ticket cancelled successfully"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Cannot cancel ticket. Either ticket not found, already validated, or cancellation window expired."));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}