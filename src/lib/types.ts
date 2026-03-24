export interface Service {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  duration: string;
  price: number;
  category: string;
  image?: string;
}

export interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  revenue?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  service: string;
}

export interface QuizAnswer {
  hairType: string;
  goal: string;
  concern: string;
  budget: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface DaySchedule {
  day: number; // 0-6
  slots: string[];
  enabled: boolean;
}
