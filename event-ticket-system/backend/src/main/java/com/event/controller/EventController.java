package com.event.controller;

import com.event.model.Event;
import com.event.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3000")
public class EventController {
    
    @Autowired
    private EventRepository eventRepository;
    
    @GetMapping("/list")
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
    
    @GetMapping("/upcoming")
    public List<Event> getUpcomingEvents() {
        return eventRepository.findByEventDateAfter(LocalDateTime.now());
    }

    @GetMapping("/my-events")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Event> getMyEvents(org.springframework.security.core.Authentication auth) {
        return eventRepository.findByAdminEmail(auth.getName());
    }
    
    @GetMapping("/search")
    public List<Event> searchEvents(@RequestParam String keyword) {
        return eventRepository.searchEvents(keyword);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEvent(@PathVariable Long id) {
        return eventRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createEvent(@RequestBody Map<String, Object> request, org.springframework.security.core.Authentication auth) {
        try {
            Event event = new Event(
                (String) request.get("name"),
                (String) request.get("description"),
                (String) request.get("location"),
                LocalDateTime.parse((String) request.get("eventDate")),
                (Integer) request.get("totalSeats"),
                ((Number) request.get("price")).doubleValue()
            );
            System.out.println("Creating event for admin: " + auth.getName());
            event.setAdminEmail(auth.getName());
            
            Event savedEvent = eventRepository.save(event);
            return ResponseEntity.ok(savedEvent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            return eventRepository.findById(id)
                .map(event -> {
                    if (request.containsKey("name")) {
                        event.setName((String) request.get("name"));
                    }
                    if (request.containsKey("description")) {
                        event.setDescription((String) request.get("description"));
                    }
                    if (request.containsKey("location")) {
                        event.setLocation((String) request.get("location"));
                    }
                    if (request.containsKey("eventDate")) {
                        event.setEventDate(LocalDateTime.parse((String) request.get("eventDate")));
                    }
                    if (request.containsKey("totalSeats")) {
                        int newTotalSeats = (Integer) request.get("totalSeats");
                        int bookedSeats = event.getTotalSeats() - event.getAvailableSeats();
                        event.setTotalSeats(newTotalSeats);
                        event.setAvailableSeats(newTotalSeats - bookedSeats);
                    }
                    if (request.containsKey("price")) {
                        event.setPrice(((Number) request.get("price")).doubleValue());
                    }
                    
                    Event updatedEvent = eventRepository.save(event);
                    return ResponseEntity.ok(updatedEvent);
                })
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        try {
            return eventRepository.findById(id)
                .map(event -> {
                    eventRepository.delete(event);
                    return ResponseEntity.ok(Map.of("message", "Event deleted successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}