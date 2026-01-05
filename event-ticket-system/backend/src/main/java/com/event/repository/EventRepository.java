package com.event.repository;

import com.event.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByEventDateAfter(LocalDateTime date);
    List<Event> findByAvailableSeatsGreaterThan(int seats);
    List<Event> findTop5ByOrderByIdDesc();
    List<Event> findByAdminEmail(String adminEmail);
    
    @Query("SELECT e FROM Event e WHERE e.eventDate BETWEEN ?1 AND ?2")
    List<Event> findEventsBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT e FROM Event e WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', ?1, '%')) OR LOWER(e.location) LIKE LOWER(CONCAT('%', ?1, '%'))")
    List<Event> searchEvents(String keyword);
}