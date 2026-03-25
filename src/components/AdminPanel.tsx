import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getServices, getBookings, updateBookings, saveServices, getSchedules, saveSchedules, getFinancialData, getSales, saveSales, getExpenses, saveExpenses, subscribeToBookings } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import type { Service, Booking } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Users, 
  Calendar, 
  Settings, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X,
  PieChart,
  BarChart3,
  Bell,
  MessageCircle,
  Repeat
} from 'lucide-react';
import { toast } from 'sonner';

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === 'adm' && pass === 'adm') {
      onLogin();
    } else {
      setError('Credenciais inválidas');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <h2 className="mb-8 text-center font-display text-3xl text-gradient-gold">Painel Admin</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={user} onChange={e => setUser(e.target.value)} placeholder="Usuário" className="w-full rounded-sm border border-border bg-card p-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Senha" className="w-full rounded-sm border border-border bg-card p-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
          {error && <p className="font-body text-xs text-destructive">{error}</p>}
          <button type="submit" className="w-full rounded-sm bg-gradient-gold py-3 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground">Entrar</button>
        </form>
      </motion.div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, colorClass }: { icon: typeof DollarSign; label: string; value: string; colorClass?: string }) => {
  const isGradient = colorClass === 'text-gradient-gold';
  return (
    <div className="rounded-sm border border-border bg-card p-6">
      <div className="mb-2 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${isGradient ? 'text-primary' : colorClass || 'text-primary'}`} />
        <span className="font-body text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <p className={`font-display text-2xl ${colorClass || 'text-foreground'}`}>{value}</p>
    </div>
  );
};

const AdminPanel = () => {
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem('admin_logged_in') === 'true');

  const handleLogin = () => {
    localStorage.setItem('admin_logged_in', 'true');
    setLoggedIn(true);
  };
  const [tab, setTab] = useState<'dashboard' | 'bookings' | 'services' | 'schedule' | 'finance'>('dashboard');
  const [services, setServicesState] = useState(getServices());
  const [bookings, setBookingsState] = useState(getBookings());
  const [editingService, setEditingService] = useState<Service | null>(null);
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [dashboardDate, setDashboardDate] = useState(new Date().toISOString().split('T')[0]);
  const [dashboardEndDate, setDashboardEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  const [showModal, setShowModal] = useState(false);
  const unseenBookings = bookings.filter(b => b.seen === false);
  const prevUnseenCount = useRef(unseenBookings.length);
  const notificationSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    notificationSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
  }, []);

  useEffect(() => {
    if (unseenBookings.length > prevUnseenCount.current) {
      setShowModal(true);
      notificationSound.current?.play().catch(e => console.log('Audio play failed:', e));
    } else if (unseenBookings.length > 0) {
      setShowModal(true);
    }
    prevUnseenCount.current = unseenBookings.length;
  }, [unseenBookings.length]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'salon_bookings' && e.newValue) {
        setBookingsState(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Inscreve no Realtime do Supabase
    const channel = subscribeToBookings((newBookings) => {
      setBookingsState(newBookings);
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      supabase.removeChannel(channel);
    };
  }, []);

  const markAllAsSeen = () => {
    const updated = bookings.map(b => ({ ...b, seen: true }));
    updateBookings(updated);
    setBookingsState(updated);
    setShowModal(false);
  };

  if (!loggedIn) return <AdminLogin onLogin={handleLogin} />;

  const financial = getFinancialData(dashboardDate, dashboardEndDate);
  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'bookings' as const, label: 'Agendamentos' },
    { id: 'services' as const, label: 'Serviços' },
    { id: 'schedule' as const, label: 'Horários' },
    { id: 'finance' as const, label: 'Vendas/Despesas' },
  ];

  const fmt = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;

  const handleStatusChange = (id: string, status: Booking['status']) => {
    setBookingsState(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, status } : b);
      updateBookings(updated);
      return updated;
    });
  };

  const handleDeleteBooking = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento para sempre?')) {
      setBookingsState(prev => {
        const updated = prev.filter(b => b.id !== id);
        updateBookings(updated);
        return updated;
      });
      toast.success('Agendamento excluído');
    }
  };

  const handleSaveService = (svc: Service) => {
    let updated;
    if (!svc.id) {
      svc.id = Date.now().toString();
      updated = [svc, ...services];
    } else {
      updated = services.map(s => s.id === svc.id ? svc : s);
    }
    saveServices(updated);
    setServicesState(updated);
    setEditingService(null);
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm('Excluir este serviço permanentemente?')) {
      const updated = services.filter(s => s.id !== id);
      saveServices(updated);
      setServicesState(updated);
      setEditingService(null);
      toast.success('Serviço excluído');
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-3xl text-gradient-gold">Painel Administrativo</h1>
          <button 
            onClick={() => {
              localStorage.removeItem('admin_logged_in');
              setLoggedIn(false);
            }} 
            className="rounded-sm border border-border px-4 py-2 font-body text-xs text-muted-foreground hover:text-white"
          >
            Sair
          </button>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap rounded-sm px-4 py-2 font-body text-xs uppercase tracking-wider transition-all ${
                tab === t.id ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:border-primary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex flex-col items-center justify-between gap-4 rounded-sm border border-border bg-card p-6 md:flex-row">
              <div>
                <h3 className="font-display text-xl text-gradient-gold">Filtro de Visualização</h3>
                <p className="font-body text-xs text-muted-foreground">Selecione uma data para analisar o desempenho</p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">Início</label>
                  <input 
                    type="date" 
                    value={dashboardDate} 
                    onChange={e => setDashboardDate(e.target.value)}
                    className="rounded-sm border border-border bg-background px-4 py-2 font-body text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">Fim</label>
                  <input 
                    type="date" 
                    value={dashboardEndDate} 
                    onChange={e => setDashboardEndDate(e.target.value)}
                    className="rounded-sm border border-border bg-background px-4 py-2 font-body text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={DollarSign} label="Faturamento no Período" value={fmt(financial.dailyRevenue)} colorClass="text-gradient-gold" />
              <StatCard icon={TrendingUp} label="Faturamento (Mês)" value={fmt(financial.monthlyRevenue)} colorClass="text-gradient-gold" />
              <StatCard icon={DollarSign} label="Despesas (Mês)" value={fmt(financial.monthlyExpenses || 0)} colorClass="text-destructive" />
              <StatCard icon={TrendingUp} label="Lucro Líquido Real" value={fmt(financial.estimatedProfit)} colorClass="text-green-500" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard icon={DollarSign} label="Faturamento no Ano" value={fmt(financial.yearlyRevenue)} colorClass="text-gradient-gold" />
              <StatCard icon={Calendar} label="Atendimentos (Período)" value={String(financial.dailyCount)} colorClass="text-foreground" />
              <StatCard icon={Users} label="Ticket Médio" value={fmt(financial.averageTicket)} colorClass="text-foreground" />
            </div>
            <div className="rounded-sm border border-border bg-card p-6">
              <h3 className="mb-4 font-body text-xs uppercase tracking-wider text-muted-foreground">Faturamento Mensal</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financial.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(40 15% 20%)" />
                    <XAxis dataKey="month" tick={{ fill: 'hsl(40 10% 55%)', fontSize: 12 }} />
                    <YAxis tick={{ fill: 'hsl(40 10% 55%)', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(0 0% 8%)', border: '1px solid hsl(40 15% 20%)', borderRadius: 2, color: 'hsl(40 20% 92%)' }} />
                    <Bar dataKey="revenue" fill="hsl(38 42% 60%)" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {tab === 'bookings' && (
          <div className="space-y-4">
            <div className="mb-6 flex flex-wrap items-center gap-4 rounded-sm border border-border bg-card p-4">
              <div className="flex flex-col gap-1">
                <label className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">Filtrar por Data</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={e => setSelectedDate(e.target.value)} 
                    className="rounded-sm border border-border bg-background px-3 py-2 font-body text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                  {selectedDate && (
                    <button 
                      onClick={() => setSelectedDate('')}
                      className="rounded-sm border border-border px-3 py-2 font-body text-xs text-muted-foreground hover:text-white"
                    >
                      Ver Todos
                    </button>
                  )}
                </div>
              </div>
              <div className="ml-auto text-right">
                <p className="font-body text-xs text-muted-foreground uppercase tracking-widest">Total no período</p>
                <p className="font-display text-xl text-gradient-gold">
                  {selectedDate 
                    ? bookings.filter(b => b.date === selectedDate).length 
                    : bookings.length} agendamentos
                </p>
              </div>
            </div>

            {(selectedDate ? bookings.filter(b => b.date === selectedDate) : bookings).length === 0 ? (
              <p className="py-8 text-center font-body text-sm text-muted-foreground">
                {selectedDate 
                  ? `Nenhum agendamento encontrado para o dia ${selectedDate.split('-').reverse().join('/')}.` 
                  : 'Nenhum agendamento cadastrado.'}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      {['Cliente','Telefone','Serviço','Preço','Data','Hora','Status','Ações'].map(h => (
                        <th key={h} className="pb-3 text-left font-body text-xs uppercase tracking-wider text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...(selectedDate ? bookings.filter(b => b.date === selectedDate) : bookings)]
                      .sort((a,b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
                      .map(b => {
                      const svc = services.find(s => s.id === b.serviceId);
                      return (
                        <tr key={b.id} className="border-b border-border/50">
                          <td className="py-3 font-body text-sm text-foreground">{b.clientName}</td>
                          <td className="py-3 font-body text-sm text-muted-foreground">{b.clientPhone}</td>
                          <td className="py-3 font-body text-sm text-muted-foreground">{svc?.name}</td>
                          <td className="py-3 font-body text-sm text-gradient-gold font-semibold">{fmt(svc?.price || 0)}</td>
                          <td className="py-3 font-body text-sm text-muted-foreground">{b.date}</td>
                          <td className="py-3 font-body text-sm text-muted-foreground">{b.time}</td>
                          <td className="py-3">
                            <span className={`rounded-full px-2 py-1 font-body text-xs ${
                              b.status === 'pending' ? 'bg-amber-900/30 text-amber-500' :
                              b.status === 'confirmed' ? 'bg-primary/20 text-primary' :
                              b.status === 'completed' ? 'bg-green-900/30 text-green-400' :
                              b.status === 'paid' ? 'bg-emerald-900/30 text-emerald-400' :
                              'bg-destructive/20 text-destructive'
                            }`}>{
                              b.status === 'pending' ? 'Pendente' : 
                              b.status === 'confirmed' ? 'Confirmado' : 
                              b.status === 'completed' ? 'Concluído' : 
                              b.status === 'paid' ? 'Pago' :
                              'Cancelado'
                            }</span>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <select
                                value={b.status}
                                onChange={e => handleStatusChange(b.id, e.target.value as Booking['status'])}
                                className="rounded-sm border border-border bg-card px-2 py-1 font-body text-xs text-foreground"
                              >
                                <option value="pending">Pendente</option>
                                <option value="confirmed">Confirmado</option>
                                <option value="paid">Pago</option>
                                <option value="completed">Concluído</option>
                                <option value="cancelled">Cancelado</option>
                              </select>
                              <button
                                onClick={() => {
                                  const phone = b.clientPhone.replace(/\D/g, '');
                                  const date = b.date.split('-').reverse().join('/');
                                  const msg = encodeURIComponent(`Olá ${b.clientName}, aqui é do Spazio Vanità! ✦ Passando para confirmar seu agendamento de ${svc?.name} para o dia ${date} às ${b.time}. Podemos confirmar?`);
                                  window.open(`https://wa.me/55${phone}?text=${msg}`, '_blank');
                                }}
                                className="flex items-center gap-1 font-body text-xs font-semibold text-green-500 hover:underline"
                              >
                                <MessageCircle size={14} />
                                WhatsApp
                              </button>
                              <button
                                onClick={() => handleDeleteBooking(b.id)}
                                className="font-body text-xs font-semibold text-destructive hover:underline"
                              >
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'services' && (
          <div className="space-y-4">
            {!editingService && (
              <div className="flex justify-end">
                <button
                  onClick={() => setEditingService({ id: '', name: '', description: '', benefits: [], duration: '', price: 0, category: 'Geral' })}
                  className="rounded-sm bg-gradient-gold px-6 py-2 font-body text-sm font-semibold uppercase text-primary-foreground"
                >
                  + Novo Serviço
                </button>
              </div>
            )}
            
            {editingService ? (
              <div className="rounded-sm border border-border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-body text-sm font-semibold text-foreground">
                    {editingService.id ? 'Editar Serviço' : 'Novo Serviço'}
                  </h3>
                  {editingService.id && (
                    <button onClick={() => handleDeleteService(editingService.id)} className="text-xs text-destructive hover:underline">
                      Excluir Serviço
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <input value={editingService.name} onChange={e => setEditingService({...editingService, name: e.target.value})} className="w-full rounded-sm border border-border bg-background p-3 font-body text-sm text-foreground focus:border-primary focus:outline-none" />
                  <textarea value={editingService.description} onChange={e => setEditingService({...editingService, description: e.target.value})} rows={3} className="w-full rounded-sm border border-border bg-background p-3 font-body text-sm text-foreground focus:border-primary focus:outline-none" />
                  <div className="flex gap-3">
                    <input type="number" value={editingService.price} onChange={e => setEditingService({...editingService, price: Number(e.target.value)})} className="w-32 rounded-sm border border-border bg-background p-3 font-body text-sm text-foreground focus:border-primary focus:outline-none" placeholder="Preço" />
                    <input value={editingService.duration} onChange={e => setEditingService({...editingService, duration: e.target.value})} className="w-32 rounded-sm border border-border bg-background p-3 font-body text-sm text-foreground focus:border-primary focus:outline-none" placeholder="Duração" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleSaveService(editingService)} className="rounded-sm bg-gradient-gold px-4 py-2 font-body text-xs font-semibold uppercase text-primary-foreground">Salvar</button>
                    <button onClick={() => setEditingService(null)} className="rounded-sm border border-border px-4 py-2 font-body text-xs text-muted-foreground">Cancelar</button>
                  </div>
                </div>
              </div>
            ) : (
              services.map(s => (
                <div key={s.id} className="flex items-center justify-between rounded-sm border border-border bg-card p-4">
                  <div>
                    <p className="font-body text-sm font-medium text-foreground">{s.name}</p>
                    <p className="font-body text-xs text-muted-foreground">{s.duration} · R$ {s.price}</p>
                  </div>
                  <button onClick={() => setEditingService({...s})} className="rounded-sm border border-border px-3 py-1 font-body text-xs text-primary hover:border-primary">Editar</button>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'schedule' && (
          <ScheduleManager />
        )}

        {tab === 'finance' && (
          <FinanceManager />
        )}
      </div>

      {/* Modal de Novos Agendamentos */}
      <AnimatePresence>
        {showModal && unseenBookings.length > 0 && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={markAllAsSeen}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-sm border border-primary/20 bg-card p-8 shadow-2xl glow-gold"
            >
              <button 
                onClick={markAllAsSeen}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>

              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bell size={32} className="animate-bounce" />
                </div>
                <h3 className="font-display text-2xl text-gradient-gold">Novos Agendamentos!</h3>
                <p className="font-body text-sm text-muted-foreground">Você tem {unseenBookings.length} agendamento(s) que ainda não foram vistos.</p>
              </div>

              <div className="mb-8 max-h-[300px] overflow-y-auto pr-2 space-y-4">
                {unseenBookings.map((b) => (
                  <div key={b.id} className="rounded-sm border border-border bg-background/50 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-body font-semibold text-foreground">{b.clientName}</span>
                      <span className="text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">Novo</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <span>Data: {b.date}</span>
                      <span>Horário: {b.time}</span>
                      <span className="col-span-2">WhatsApp: {b.clientPhone}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={markAllAsSeen}
                className="w-full rounded-sm bg-gradient-gold py-4 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:scale-[1.02]"
              >
                Entendido, Fechar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ScheduleManager = () => {
  const [schedules, setSchedulesState] = useState(getSchedules());
  const days = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];

  const toggleDay = (day: number) => {
    const updated = schedules.map(s => s.day === day ? { ...s, enabled: !s.enabled } : s);
    saveSchedules(updated);
    setSchedulesState(updated);
  };

  return (
    <div className="space-y-4">
      {schedules.map(s => (
        <div key={s.day} className="flex items-center justify-between rounded-sm border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <button onClick={() => toggleDay(s.day)} className={`h-4 w-4 rounded-sm border transition-all ${s.enabled ? 'border-primary bg-primary' : 'border-border'}`} />
            <span className="font-body text-sm text-foreground">{days[s.day]}</span>
          </div>
          <span className="font-body text-xs text-muted-foreground">
            {s.enabled ? s.slots.join(', ') : 'Fechado'}
          </span>
        </div>
      ))}
    </div>
  );
};

const FinanceManager = () => {
  const [sales, setSalesState] = useState(getSales());
  const [expenses, setExpensesState] = useState(getExpenses());
  
  const [newSaleDesc, setNewSaleDesc] = useState('');
  const [newSaleValue, setNewSaleValue] = useState('');
  const [newExpenseDesc, setNewExpenseDesc] = useState('');
  const [newExpenseValue, setNewExpenseValue] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleAddSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSaleDesc || !newSaleValue) return;
    const ns = { id: Date.now().toString(), description: newSaleDesc, value: Number(newSaleValue), date: today };
    const updated = [ns, ...sales];
    saveSales(updated);
    setSalesState(updated);
    setNewSaleDesc('');
    setNewSaleValue('');
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseDesc || !newExpenseValue) return;
    const ne = { 
      id: Date.now().toString(), 
      description: newExpenseDesc, 
      value: Number(newExpenseValue), 
      date: today,
      isRecurring 
    };
    const updated = [ne, ...expenses];
    saveExpenses(updated);
    setExpensesState(updated);
    setNewExpenseDesc('');
    setNewExpenseValue('');
    setIsRecurring(false);
  };

  const handleDeleteSale = (id: string) => {
    const updated = sales.filter(s => s.id !== id);
    saveSales(updated);
    setSalesState(updated);
    toast.success('Venda excluída');
  };

  const handleDeleteExpense = (id: string) => {
    const updated = expenses.filter(e => e.id !== id);
    saveExpenses(updated);
    setExpensesState(updated);
    toast.success('Despesa excluída');
  };

  const fmt = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-sm border border-border bg-card p-6">
        <h3 className="mb-4 font-display text-xl text-gradient-gold">Vendas Avulsas</h3>
        <form onSubmit={handleAddSale} className="mb-6 space-y-3">
          <input value={newSaleDesc} onChange={e => setNewSaleDesc(e.target.value)} placeholder="Descrição do serviço/produto" className="w-full rounded-sm border border-border bg-background p-3 font-body text-sm text-foreground focus:border-primary focus:outline-none" />
          <div className="flex gap-3">
            <input type="number" step="0.01" value={newSaleValue} onChange={e => setNewSaleValue(e.target.value)} placeholder="Valor (R$)" className="w-full rounded-sm border border-border bg-background p-3 font-body text-sm text-foreground focus:border-primary focus:outline-none" />
            <button type="submit" className="rounded-sm bg-gradient-gold px-6 py-3 font-body text-sm font-semibold uppercase text-primary-foreground">Adicionar</button>
          </div>
        </form>
        <div className="space-y-3">
          {sales.slice(0, 50).map(s => (
            <div key={s.id} className="flex items-center justify-between border-b border-border/50 pb-2">
              <div>
                <p className="font-body text-sm text-foreground">{s.description}</p>
                <p className="font-body text-xs text-muted-foreground">{s.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-body text-sm text-green-400">+{fmt(s.value)}</span>
                <button onClick={() => handleDeleteSale(s.id)} className="text-xs text-destructive hover:underline">Excluir</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-sm border border-border bg-card p-6">
        <h3 className="mb-4 font-display text-xl text-gradient-gold">Despesas da Empresa</h3>
        <form onSubmit={handleAddExpense} className="mb-6 space-y-3">
          <input value={newExpenseDesc} onChange={e => setNewExpenseDesc(e.target.value)} placeholder="Descrição da despesa" className="w-full rounded-sm border border-border bg-background p-3 font-body text-sm text-foreground focus:border-primary focus:outline-none" />
          <div className="flex items-center gap-3">
            <input type="number" step="0.01" value={newExpenseValue} onChange={e => setNewExpenseValue(e.target.value)} placeholder="Valor (R$)" className="w-full rounded-sm border border-border bg-background p-3 font-body text-sm text-foreground focus:border-primary focus:outline-none" />
            <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-sm border border-border bg-background px-3 py-2 text-muted-foreground outline-none transition-all hover:border-primary focus:border-primary">
              <input type="checkbox" checked={isRecurring} onChange={e => setIsRecurring(e.target.checked)} className="h-4 w-4 rounded border-border-border bg-background text-primary focus:ring-primary" />
              <span className="font-body text-xs">Recorrente</span>
            </label>
            <button type="submit" className="rounded-sm bg-destructive px-6 py-3 font-body text-sm font-semibold uppercase text-destructive-foreground hover:bg-destructive/90 transition-all">Adicionar</button>
          </div>
        </form>
        <div className="space-y-3">
          {expenses.slice(0, 50).map(e => (
            <div key={e.id} className="flex items-center justify-between border-b border-border/50 pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-body text-sm text-foreground">{e.description}</p>
                  {e.isRecurring && (
                    <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-body text-[10px] text-primary">
                      <Repeat size={8} />
                      Recorrente
                    </span>
                  )}
                </div>
                <p className="font-body text-xs text-muted-foreground">{e.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-body text-sm text-destructive">-{fmt(e.value)}</span>
                <button onClick={() => handleDeleteExpense(e.id)} className="text-xs text-muted-foreground hover:text-destructive hover:underline">Excluir</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
