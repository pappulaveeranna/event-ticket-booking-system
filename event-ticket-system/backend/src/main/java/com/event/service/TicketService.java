package com.event.service;

import com.event.model.Event;
import com.event.model.Ticket;
import com.event.repository.EventRepository;
import com.event.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class TicketService {
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private QRCodeService qrCodeService;
    
    @Transactional
    public Ticket bookTicket(Long eventId, String userEmail, int numberOfSeats, List<String> seatNumbers) throws Exception {
        // Check if event exists and has available seats
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        // Check if event is in the future
        if (event.getEventDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot book tickets for past events");
        }
        
        // Check availability
        if (event.getAvailableSeats() < numberOfSeats) {
            throw new RuntimeException("Not enough seats available. Only " + event.getAvailableSeats() + " seats left.");
        }

        // Validate that these specific seats aren't already taken
        List<String> alreadyBooked = getBookedSeats(eventId);
        for (String seat : seatNumbers) {
            if (alreadyBooked.contains(seat)) {
                throw new RuntimeException("Seat " + seat + " is already booked. Please select another seat.");
            }
        }
        
        // Generate unique QR code data
        String qrData = eventId + "_" + userEmail + "_" + numberOfSeats + "_" + UUID.randomUUID().toString();
        String qrCodeImage = qrCodeService.generateQRCode(qrData);
        
        // Convert seat list to comma-separated string
        String seatString = String.join(",", seatNumbers);
        
        // Create one ticket for all seats
        Ticket ticket = new Ticket(eventId, userEmail, qrData, qrCodeImage, numberOfSeats, seatString);
        
        // Update available seats by the number of seats booked
        event.setAvailableSeats(event.getAvailableSeats() - numberOfSeats);
        eventRepository.save(event);
        
        return ticketRepository.save(ticket);
    }

    public List<String> getBookedSeats(Long eventId) {
        List<Ticket> tickets = ticketRepository.findByEventId(eventId);
        List<String> bookedSeats = new ArrayList<>();
        
        for (Ticket ticket : tickets) {
            if (ticket.getSeatNumbers() != null && !ticket.getSeatNumbers().isEmpty()) {
                String[] seats = ticket.getSeatNumbers().split(",");
                for (String seat : seats) {
                    bookedSeats.add(seat.trim());
                }
            }
        }
        return bookedSeats;
    }
    
    @Transactional
    public Map<String, Object> validateTicket(String qrCode) {
        Ticket ticket = ticketRepository.findByQrCode(qrCode);
        
        if (ticket == null) {
            return Map.of(
                "valid", false,
                "message", "INVALID TICKET - QR Code not found in system"
            );
        }
        
        if (ticket.isValidated()) {
            return Map.of(
                "valid", false,
                "message", "ALREADY USED - Ticket validated on " + ticket.getValidationTime()
            );
        }
        
        // Check if event exists
        Event event = eventRepository.findById(ticket.getEventId()).orElse(null);
        if (event == null) {
            return Map.of(
                "valid", false,
                "message", "INVALID TICKET - Event not found"
            );
        }
        
        // Mark as validated
        ticket.setValidated(true);
        ticket.setValidationTime(LocalDateTime.now());
        ticketRepository.save(ticket);
        
        return Map.of(
            "valid", true,
            "message", "VALID ENTRY - Welcome to " + event.getName() + "!",
            "ticketId", ticket.getId(),
            "eventName", event.getName(),
            "eventDate", event.getEventDate().toString(),
            "eventLocation", event.getLocation(),
            "userEmail", ticket.getUserEmail(),
            "validationTime", ticket.getValidationTime().toString()
        );
    }
    
    public List<Ticket> getUserTickets(String userEmail) {
        return ticketRepository.findByUserEmail(userEmail);
    }
    
    public List<Ticket> getEventTickets(Long eventId) {
        return ticketRepository.findByEventId(eventId);
    }
    
    public Ticket getTicketWithEventDetails(Long ticketId) {
        return ticketRepository.findById(ticketId).orElse(null);
    }
    
    @Transactional
    public boolean cancelTicket(Long ticketId, String userEmail) {
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
        
        if (ticket == null || !ticket.getUserEmail().equals(userEmail)) {
            return false;
        }
        
        if (ticket.isValidated()) {
            return false; // Cannot cancel validated tickets
        }
        
        Event event = eventRepository.findById(ticket.getEventId()).orElse(null);
        if (event == null) {
            return false;
        }
        
        // Check if cancellation is allowed (at least 24 hours before event)
        if (event.getEventDate().minusHours(24).isBefore(LocalDateTime.now())) {
            return false;
        }
        
        // Restore available seats
        event.setAvailableSeats(event.getAvailableSeats() + ticket.getNumberOfSeats());
        eventRepository.save(event);
        
        // Delete ticket
        ticketRepository.delete(ticket);
        
        return true;
    }
}