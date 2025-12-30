package com.event.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long eventId;
    private String userEmail;
    
    @Column(unique = true)
    private String qrCode;
    
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String qrCodeImage;
    
    private boolean validated = false;
    private LocalDateTime bookingTime;
    private LocalDateTime validationTime;
    private int numberOfSeats = 1;
    
    // Constructors
    public Ticket() {
        this.bookingTime = LocalDateTime.now();
    }
    
    public Ticket(Long eventId, String userEmail, String qrCode, String qrCodeImage) {
        this.eventId = eventId;
        this.userEmail = userEmail;
        this.qrCode = qrCode;
        this.qrCodeImage = qrCodeImage;
        this.bookingTime = LocalDateTime.now();
    }
    
    public Ticket(Long eventId, String userEmail, String qrCode, String qrCodeImage, int numberOfSeats) {
        this.eventId = eventId;
        this.userEmail = userEmail;
        this.qrCode = qrCode;
        this.qrCodeImage = qrCodeImage;
        this.numberOfSeats = numberOfSeats;
        this.bookingTime = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }
    
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    
    public String getQrCode() { return qrCode; }
    public void setQrCode(String qrCode) { this.qrCode = qrCode; }
    
    public String getQrCodeImage() { return qrCodeImage; }
    public void setQrCodeImage(String qrCodeImage) { this.qrCodeImage = qrCodeImage; }
    
    public boolean isValidated() { return validated; }
    public void setValidated(boolean validated) { 
        this.validated = validated;
        if (validated) {
            this.validationTime = LocalDateTime.now();
        }
    }
    
    public LocalDateTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; }
    
    public LocalDateTime getValidationTime() { return validationTime; }
    public void setValidationTime(LocalDateTime validationTime) { this.validationTime = validationTime; }
    
    public int getNumberOfSeats() { return numberOfSeats; }
    public void setNumberOfSeats(int numberOfSeats) { this.numberOfSeats = numberOfSeats; }
}