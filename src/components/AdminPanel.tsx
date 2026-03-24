import { useState } from 'react';
import { motion } from 'framer-motion';
import { getServices, getBookings, updateBookings, saveServices, getSchedules, saveSchedules, getFinancialData } from '@/lib/store';
import type { Service, Booking } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, TrendingUp, Calendar } from 'lucide-react';

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

const StatCard = ({ icon: Icon, label, value }: { icon: typeof DollarSign; label: string; value: string }) => (
  <div className="rounded-sm border border-border bg-card p-6">
    <div className="mb-2 flex items-center gap-2">
      <Icon className="h-4 w-4 text-primary" />
      <span className="font-body text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
    <p className="font-display text-2xl text-foreground">{value}</p>
  </div>
);

const AdminPanel = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState<'dashboard' | 'bookings' | 'services' | 'schedule'>('dashboard');
  const [services, setServicesState] = useState(getServices());
  const [bookings, setBookingsState] = useState(getBookings());
  const [editingService, setEditingService] = useState<Service | null>(null);

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  const financial = getFinancialData();
  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'bookings' as const, label: 'Agendamentos' },
    { id: 'services' as const, label: 'Serviços' },
    { id: 'schedule' as const, label: 'Horários' },
  ];

  const fmt = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;

  const handleStatusChange = (id: string, status: Booking['status']) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
    updateBookings(updated);
    setBookingsState(updated);
  };

  const handleSaveService = (svc: Service) => {
    const updated = services.map(s => s.id === svc.id ? svc : s);
    saveServices(updated);
    setServicesState(updated);
    setEditingService(null);
  };

  return (
    <div className="min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 font-display text-3xl text-gradient-gold">Painel Administrativo</h1>

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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={DollarSign} label="Faturamento Hoje" value={fmt(financial.dailyRevenue)} />
              <StatCard icon={TrendingUp} label="Faturamento Mensal" value={fmt(financial.monthlyRevenue)} />
              <StatCard icon={Calendar} label="Atendimentos (mês)" value={String(financial.monthlyCount)} />
              <StatCard icon={Users} label="Ticket Médio" value={fmt(financial.averageTicket)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard icon={DollarSign} label="Faturamento Anual" value={fmt(financial.yearlyRevenue)} />
              <StatCard icon={TrendingUp} label="Lucro Estimado (mês)" value={fmt(financial.estimatedProfit)} />
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
            {bookings.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground">Nenhum agendamento.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      {['Cliente','Telefone','Serviço','Data','Hora','Status','Ações'].map(h => (
                        <th key={h} className="pb-3 text-left font-body text-xs uppercase tracking-wider text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.sort((a,b) => b.date.localeCompare(a.date)).map(b => {
                      const svc = services.find(s => s.id === b.serviceId);
                      return (
                        <tr key={b.id} className="border-b border-border/50">
                          <td className="py-3 font-body text-sm text-foreground">{b.clientName}</td>
                          <td className="py-3 font-body text-sm text-muted-foreground">{b.clientPhone}</td>
                          <td className="py-3 font-body text-sm text-muted-foreground">{svc?.name}</td>
                          <td className="py-3 font-body text-sm text-muted-foreground">{b.date}</td>
                          <td className="py-3 font-body text-sm text-muted-foreground">{b.time}</td>
                          <td className="py-3">
                            <span className={`rounded-full px-2 py-1 font-body text-xs ${
                              b.status === 'confirmed' ? 'bg-primary/20 text-primary' :
                              b.status === 'completed' ? 'bg-green-900/30 text-green-400' :
                              'bg-destructive/20 text-destructive'
                            }`}>{b.status === 'confirmed' ? 'Confirmado' : b.status === 'completed' ? 'Concluído' : 'Cancelado'}</span>
                          </td>
                          <td className="py-3">
                            <select
                              value={b.status}
                              onChange={e => handleStatusChange(b.id, e.target.value as Booking['status'])}
                              className="rounded-sm border border-border bg-card px-2 py-1 font-body text-xs text-foreground"
                            >
                              <option value="confirmed">Confirmado</option>
                              <option value="completed">Concluído</option>
                              <option value="cancelled">Cancelado</option>
                            </select>
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
            {editingService ? (
              <div className="rounded-sm border border-border bg-card p-6">
                <h3 className="mb-4 font-body text-sm font-semibold text-foreground">Editar Serviço</h3>
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
      </div>
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

export default AdminPanel;
