import { supabase } from './supabase';
import type { Service, Booking, Testimonial, DaySchedule, Sale, Expense } from './types';

const SERVICES_KEY = 'salon_services';
const BOOKINGS_KEY = 'salon_bookings';
const SCHEDULES_KEY = 'salon_schedules';
const SALES_KEY = 'salon_sales';
const EXPENSES_KEY = 'salon_expenses';

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

export async function syncFromSupabase() {
  try {
    const [
      { data: b },
      { data: s },
      { data: sch },
      { data: sl },
      { data: e }
    ] = await Promise.all([
      supabase.from('bookings').select('*'),
      supabase.from('services').select('*'),
      supabase.from('schedules').select('*'),
      supabase.from('sales').select('*'),
      supabase.from('expenses').select('*')
    ]);

    // Se o banco estiver vazio mas o local tiver dados, faz o upload inicial
    if (s && s.length === 0) {
      const localSvc = getServices();
      const localSch = getSchedules();
      const localBk = getBookings();
      const localSl = getSales();
      const localEx = getExpenses();
      
      await Promise.all([
        supabase.from('services').upsert(localSvc),
        supabase.from('schedules').upsert(localSch),
        supabase.from('bookings').upsert(localBk),
        supabase.from('sales').upsert(localSl),
        supabase.from('expenses').upsert(localEx)
      ]);
      return true;
    }

    if (b && b.length > 0) setItem(BOOKINGS_KEY, b);
    if (s && s.length > 0) setItem(SERVICES_KEY, s);
    if (sch && sch.length > 0) setItem(SCHEDULES_KEY, sch);
    if (sl && sl.length > 0) setItem(SALES_KEY, sl);
    if (e && e.length > 0) setItem(EXPENSES_KEY, e);
    
    return true;
  } catch (err) {
    console.error('Error syncing from Supabase:', err);
    return false;
  }
}

export function subscribeToBookings(callback: (bookings: Booking[]) => void) {
  // Configura a assinatura no canal de realtime da tabela bookings
  const channel = supabase.channel('public:bookings')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, async (payload) => {
      // Quando ocorre mudança no banco, busca a lista completa mais atualizada (ou pode otimisticamente atualizar)
      const { data } = await supabase.from('bookings').select('*');
      if (data) {
        setItem(BOOKINGS_KEY, data);
        callback(data as Booking[]);
      }
    });
    
  return channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      console.log('Realtime bookings sync ativo!');
    }
  });
}


export function getServices(): Service[] {
  return getItem(SERVICES_KEY, defaultServices);
}

export function saveServices(services: Service[]) {
  setItem(SERVICES_KEY, services);
  supabase.from('services').upsert(services).then();
}

export function getBookings(): Booking[] {
  return getItem(BOOKINGS_KEY, []);
}

export function saveBooking(booking: Booking) {
  const b = { ...booking, seen: false };
  const bookings = getBookings();
  bookings.push(b);
  setItem(BOOKINGS_KEY, bookings);
  
  supabase.from('bookings').insert(b).then(({ error }) => {
    if (error) {
      console.error('Erro ao salvar no banco em nuvem:', error);
      // Se não fosse silencioso, poderíamos disparar um toast de erro aqui, 
      // mas como pode ser falta de internet, deixamos apenas no console.
    }
  });
}

export function updateBookings(bookings: Booking[]) {
  setItem(BOOKINGS_KEY, bookings);
  supabase.from('bookings').upsert(bookings).then();
}

export function getSchedules(): DaySchedule[] {
  return getItem(SCHEDULES_KEY, defaultSchedules);
}

export function saveSchedules(schedules: DaySchedule[]) {
  setItem(SCHEDULES_KEY, schedules);
  supabase.from('schedules').upsert(schedules).then();
}

export function getSales(): Sale[] {
  return getItem(SALES_KEY, []);
}

export function saveSales(sales: Sale[]) {
  setItem(SALES_KEY, sales);
  supabase.from('sales').upsert(sales).then();
}

export function getExpenses(): Expense[] {
  return getItem(EXPENSES_KEY, []);
}

export function saveExpenses(expenses: Expense[]) {
  setItem(EXPENSES_KEY, expenses);
  supabase.from('expenses').upsert(expenses).then();
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

  const d = new Date();
  const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const [currentH, currentM] = [d.getHours(), d.getMinutes()];

  return daySchedule.slots.filter(slot => {
    if (bookedTimes.includes(slot)) return false;
    
    // Se for hoje (local), filtrar horários passados
    if (dateStr === todayStr) {
      const [h, m] = slot.split(':').map(Number);
      if (h < currentH || (h === currentH && m <= currentM)) {
        return false;
      }
    }
    return true;
  });
}

export function getFinancialData(startDate?: string, endDate?: string) {
  const bookings = getBookings().filter(b => b.status === 'paid' || b.status === 'completed');
  const services = getServices();
  const sales = getSales();
  const expenses = getExpenses();
  
  const start = startDate || new Date().toISOString().split('T')[0];
  const end = endDate || start;

  const thisMonth = start.substring(0, 7);
  const thisYear = start.substring(0, 4);

  const getBookingRevenue = (b: Booking) => {
    if (b.revenue) return b.revenue;
    const svc = services.find(s => s.id === b.serviceId);
    return svc?.price || 0;
  };

  const periodBookings = bookings.filter(b => b.date >= start && b.date <= end);
  const monthlyBookings = bookings.filter(b => b.date.startsWith(thisMonth));
  const yearlyBookings = bookings.filter(b => b.date.startsWith(thisYear));

  const periodSales = sales.filter(s => s.date >= start && s.date <= end);
  const monthlySales = sales.filter(s => s.date.startsWith(thisMonth));
  const yearlySales = sales.filter(s => s.date.startsWith(thisYear));

  const monthlyExpensesList = expenses.filter(e => 
    e.date.startsWith(thisMonth) || (e.isRecurring && e.date.substring(0, 7) <= thisMonth)
  );

  const sumBookings = (bs: Booking[]) => bs.reduce((acc, b) => acc + getBookingRevenue(b), 0);
  const sumSales = (ss: Sale[]) => ss.reduce((acc, s) => acc + s.value, 0);
  const sumExpenses = (es: Expense[]) => es.reduce((acc, e) => acc + e.value, 0);

  const mRevenue = sumBookings(monthlyBookings) + sumSales(monthlySales);
  const mExpenses = sumExpenses(monthlyExpensesList);

  return {
    dailyRevenue: sumBookings(periodBookings) + sumSales(periodSales),
    monthlyRevenue: mRevenue,
    yearlyRevenue: sumBookings(yearlyBookings) + sumSales(yearlySales),
    monthlyExpenses: mExpenses,
    dailyCount: periodBookings.length + periodSales.length,
    monthlyCount: monthlyBookings.length + monthlySales.length,
    yearlyCount: yearlyBookings.length + yearlySales.length,
    averageTicket: (bookings.length + sales.length) > 0 
      ? (sumBookings(bookings) + sumSales(sales)) / (bookings.length + sales.length) 
      : 0,
    estimatedProfit: mRevenue - mExpenses,
    monthlyData: Array.from({ length: 12 }, (_, i) => {
      const referenceDate = new Date(start + 'T12:00:00');
      const year = referenceDate.getFullYear();
      const monthStr = `${year}-${String(i + 1).padStart(2, '0')}`;
      const mBookings = bookings.filter(b => b.date.startsWith(monthStr));
      const mSales = sales.filter(s => s.date.startsWith(monthStr));
      return { 
        month: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][i], 
        revenue: sumBookings(mBookings) + sumSales(mSales), 
        count: mBookings.length + mSales.length 
      };
    }),
  };
}
