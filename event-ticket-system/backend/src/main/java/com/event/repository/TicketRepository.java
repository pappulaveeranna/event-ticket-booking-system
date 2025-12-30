package com.event.repository;

import com.event.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Ticket findByQrCode(String qrCode);
    List<Ticket> findByUserEmail(String userEmail);
    List<Ticket> findByEventId(Long eventId);
    boolean existsByEventIdAndUserEmail(Long eventId, String userEmail);
    
    // Admin dashboard queries
    long countByValidatedTrue();
    List<Ticket> findByValidatedTrue();
    List<Ticket> findByValidatedFalse();
    
    @Query("SELECT t.eventId, COUNT(t) as bookingCount FROM Ticket t GROUP BY t.eventId ORDER BY bookingCount DESC")
    List<Object[]> findMostBookedEvents();
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.eventId = ?1")
    long countByEventId(Long eventId);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM Ticket t WHERE t.userEmail = ?1")
    void deleteByUserEmail(String userEmail);
}