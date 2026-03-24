import { Service, Booking, Testimonial, DaySchedule } from './types';

const SERVICES_KEY = 'salon_services';
const BOOKINGS_KEY = 'salon_bookings';
const SCHEDULES_KEY = 'salon_schedules';

const defaultServices: Service[] = [
  {
    id: '1',
    name: 'Coloração Premium',
    description: 'Coloração profissional com produtos de alta performance. Técnica personalizada para realçar sua beleza natural com cores vibrantes e duradouras.',
    benefits: ['Cobertura perfeita de fios brancos', 'Brilho intenso e duradouro', 'Produtos sem amônia disponíveis', 'Cor personalizada para seu tom de pele'],
    duration: '2h30',
    price: 350,
    category: 'Coloração',
  },
  {
    id: '2',
    name: 'Mechas & Luzes',
    description: 'Técnicas modernas de mechas que proporcionam um efeito natural e sofisticado. Iluminação facial e dimensão aos fios.',
    benefits: ['Efeito natural e dimensional', 'Técnicas como balayage e babylights', 'Transição suave entre tons', 'Manutenção a cada 3-4 meses'],
    duration: '3h30',
    price: 550,
    category: 'Coloração',
  },
  {
    id: '3',
    name: 'Corte Feminino',
    description: 'Corte personalizado que valoriza seu formato de rosto, textura dos fios e estilo pessoal. Inclui lavagem e finalização.',
    benefits: ['Análise de formato do rosto', 'Técnica de corte a seco ou molhado', 'Finalização profissional inclusa', 'Dicas de manutenção em casa'],
    duration: '1h',
    price: 180,
    category: 'Corte',
  },
  {
    id: '4',
    name: 'Tratamento Capilar Profundo',
    description: 'Restauração intensiva dos fios com tratamentos de alta tecnologia. Recupera a saúde, brilho e maciez dos cabelos danificados.',
    benefits: ['Hidratação profunda', 'Reconstrução da fibra capilar', 'Selamento de cutículas', 'Resultados imediatos e visíveis'],
    duration: '1h30',
    price: 250,
    category: 'Tratamento',
  },
  {
    id: '5',
    name: 'Escova Modeladora',
    description: 'Escova profissional com técnica de modelagem que garante volume, movimento e brilho extraordinário por dias.',
    benefits: ['Durabilidade de 3-5 dias', 'Volume controlado', 'Brilho espelhado', 'Finalização com proteção térmica'],
    duration: '1h',
    price: 120,
    category: 'Finalização',
  },
  {
    id: '6',
    name: 'Penteado para Eventos',
    description: 'Penteados exclusivos para casamentos, formaturas e eventos especiais. Criação sob medida para o seu momento.',
    benefits: ['Teste prévio incluso', 'Fixação duradoura', 'Acessórios disponíveis', 'Atendimento no local do evento'],
    duration: '2h',
    price: 400,
    category: 'Finalização',
  },
];

const defaultTestimonials: Testimonial[] = [
  { id: '1', name: 'Carolina M.', text: 'Experiência incrível! Minhas mechas ficaram exatamente como eu sonhava. O ambiente é lindo e o atendimento impecável.', rating: 5, service: 'Mechas & Luzes' },
  { id: '2', name: 'Fernanda S.', text: 'Fiz o tratamento capilar e meu cabelo renasceu! Nunca tinha ficado tão macio e brilhante. Super recomendo.', rating: 5, service: 'Tratamento Capilar' },
  { id: '3', name: 'Juliana R.', text: 'O corte ficou perfeito, valorizou muito meu rosto. A profissional entendeu exatamente o que eu queria.', rating: 5, service: 'Corte Feminino' },
  { id: '4', name: 'Mariana L.', text: 'Fiz meu penteado de casamento aqui e foi simplesmente perfeito. Durou a festa toda! Equipe maravilhosa.', rating: 5, service: 'Penteado para Eventos' },
  { id: '5', name: 'Patricia A.', text: 'A coloração ficou impecável! Cor vibrante, sem danificar os fios. Já sou cliente fiel há 2 anos.', rating: 5, service: 'Coloração Premium' },
];

const defaultSchedules: DaySchedule[] = [
  { day: 0, slots: [], enabled: false },
  { day: 1, slots: ['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00'], enabled: true },
  { day: 2, slots: ['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00'], enabled: true },
  { day: 3, slots: ['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00'], enabled: true },
  { day: 4, slots: ['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00'], enabled: true },
  { day: 5, slots: ['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00'], enabled: true },
  { day: 6, slots: ['09:00','10:00','11:00','12:00','13:00'], enabled: true },
];

function getItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getServices(): Service[] {
  return getItem(SERVICES_KEY, defaultServices);
}

export function saveServices(services: Service[]) {
  setItem(SERVICES_KEY, services);
}

export function getBookings(): Booking[] {
  return getItem(BOOKINGS_KEY, []);
}

export function saveBooking(booking: Booking) {
  const bookings = getBookings();
  bookings.push(booking);
  setItem(BOOKINGS_KEY, bookings);
}

export function updateBookings(bookings: Booking[]) {
  setItem(BOOKINGS_KEY, bookings);
}

export function getSchedules(): DaySchedule[] {
  return getItem(SCHEDULES_KEY, defaultSchedules);
}

export function saveSchedules(schedules: DaySchedule[]) {
  setItem(SCHEDULES_KEY, schedules);
}

export function getTestimonials(): Testimonial[] {
  return defaultTestimonials;
}

export function getAvailableSlots(date: Date, serviceId: string): string[] {
  const schedules = getSchedules();
  const daySchedule = schedules.find(s => s.day === date.getDay());
  if (!daySchedule || !daySchedule.enabled) return [];

  const bookings = getBookings();
  const dateStr = date.toISOString().split('T')[0];
  const bookedTimes = bookings
    .filter(b => b.date === dateStr && b.status !== 'cancelled')
    .map(b => b.time);

  return daySchedule.slots.filter(slot => !bookedTimes.includes(slot));
}

export function getFinancialData() {
  const bookings = getBookings().filter(b => b.status !== 'cancelled');
  const services = getServices();
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const thisYear = String(now.getFullYear());

  const getRevenue = (b: Booking) => {
    if (b.revenue) return b.revenue;
    const svc = services.find(s => s.id === b.serviceId);
    return svc?.price || 0;
  };

  const dailyBookings = bookings.filter(b => b.date === today);
  const monthlyBookings = bookings.filter(b => b.date.startsWith(thisMonth));
  const yearlyBookings = bookings.filter(b => b.date.startsWith(thisYear));

  const sum = (bs: Booking[]) => bs.reduce((acc, b) => acc + getRevenue(b), 0);

  return {
    dailyRevenue: sum(dailyBookings),
    monthlyRevenue: sum(monthlyBookings),
    yearlyRevenue: sum(yearlyBookings),
    dailyCount: dailyBookings.length,
    monthlyCount: monthlyBookings.length,
    yearlyCount: yearlyBookings.length,
    averageTicket: bookings.length > 0 ? sum(bookings) / bookings.length : 0,
    estimatedProfit: sum(monthlyBookings) * 0.6,
    monthlyData: Array.from({ length: 12 }, (_, i) => {
      const month = `${now.getFullYear()}-${String(i + 1).padStart(2, '0')}`;
      const mBookings = bookings.filter(b => b.date.startsWith(month));
      return { month: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][i], revenue: sum(mBookings), count: mBookings.length };
    }),
  };
}
