-- Sample Events Data
INSERT INTO events (name, description, location, event_date, total_seats, available_seats, price) VALUES
('Tech Conference 2024', 'Annual technology conference with industry leaders discussing AI, Cloud Computing, and Future Tech', 'Convention Center, New York', '2025-06-15 09:00:00', 500, 500, 299.99);

INSERT INTO events (name, description, location, event_date, total_seats, available_seats, price) VALUES
('Summer Music Festival', 'Three-day music festival featuring top artists from around the world', 'Central Park, New York', '2025-07-20 18:00:00', 1000, 1000, 149.99);

INSERT INTO events (name, description, location, event_date, total_seats, available_seats, price) VALUES
('Food & Wine Expo', 'Culinary experience with renowned chefs and wine tastings', 'Grand Hotel, Los Angeles', '2025-06-25 12:00:00', 200, 200, 89.99);

INSERT INTO events (name, description, location, event_date, total_seats, available_seats, price) VALUES
('Sports Championship Final', 'Final championship game of the season', 'Stadium Arena, Chicago', '2025-08-10 19:30:00', 2000, 2000, 199.99);

-- Create admin user (password: admin123)
INSERT INTO users (email, password, role) VALUES
('admin@event.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'ADMIN');

-- Create test users (password: user123)  
INSERT INTO users (email, password, role) VALUES
('user@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'USER');

INSERT INTO users (email, password, role) VALUES
('john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'USER');