export interface User {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface Event {
  id: number;
  name: string;
  description: string;
  location: string;
  eventDate: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
}

export interface Ticket {
  id: number;
  eventId: number;
  userEmail: string;
  qrCode: string;
  qrCodeImage: string;
  validated: boolean;
  bookingTime: string;
  validationTime?: string;
  numberOfSeats: number;
  seatNumbers?: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  fullName?: string;
}

export interface DashboardStats {
  totalEvents: number;
  totalUsers: number;
  totalTickets: number;
  validatedTickets: number;
  totalRevenue: number;
  recentEvents: Event[];
  popularEvents: any[];
}

export interface ValidationResponse {
  message: string;
  valid: boolean;
}