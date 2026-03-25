import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAvailableSlots, saveBooking, useServices } from '@/lib/store';
import { toast } from 'sonner';

const formatWhatsApp = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  let res = '';
  if (digits.length > 0) {
    res = `(${digits.slice(0, 2)}`;
    if (digits.length > 2) {
      res += `) ${digits.slice(2, 3)}`;
      if (digits.length > 3) {
        res += ` ${digits.slice(3, 7)}`;
        if (digits.length > 7) {
          res += `-${digits.slice(7)}`;
        }
      }
    }
  }
  return res;
};

const BookingSystem = () => {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get('service') || '';
  const services = useServices();

  const [selectedService, setSelectedService] = useState(preselectedService);
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [confirmPhone, setConfirmPhone] = useState('');
  const [booked, setBooked] = useState(false);

  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    return getAvailableSlots(new Date(selectedDate + 'T12:00:00'), selectedService);
  }, [selectedDate, selectedService]);

  const minDate = todayStr;
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime || !clientName || !clientPhone || !confirmPhone) {
      toast.error('Preencha todos os campos');
      return;
    }
    if (clientPhone !== confirmPhone) {
      toast.error('Os números de WhatsApp não coincidem');
      return;
    }
    const svc = services.find(s => s.id === selectedService);
    saveBooking({
      id: Date.now().toString(),
      clientName,
      clientPhone,
      serviceId: selectedService,
      date: selectedDate,
      time: selectedTime,
      status: 'pending',
      createdAt: new Date().toISOString(),
      revenue: svc?.price,
    });
    setBooked(true);
    toast.success('Agendamento enviado para análise!');
  };

  if (booked) {
    const svc = services.find(s => s.id === selectedService);
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-lg px-6 py-24 text-center"
      >
        <div className="mb-6 h-px w-16 mx-auto bg-gradient-gold" />
        <h2 className="mb-4 font-display text-4xl text-gradient-gold">Enviado!</h2>
        <p className="mb-2 font-body text-sm text-muted-foreground">{svc?.name}</p>
        <p className="mb-1 font-body text-sm text-foreground">{selectedDate} às {selectedTime}</p>
        <p className="mb-8 font-body text-sm text-muted-foreground">{clientName}</p>
        <p className="font-body text-xs text-muted-foreground">
          Aguarde nossa confirmação por WhatsApp. Até breve! ✦
        </p>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-10 text-center">
          <p className="mb-3 font-body text-xs tracking-[0.3em] uppercase text-primary">Agendamento</p>
          <h2 className="font-display text-4xl font-light text-gradient-gold">Reserve seu Horário</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block font-body text-xs tracking-wider uppercase text-muted-foreground">Serviço</label>
            <select
              value={selectedService}
              onChange={e => { setSelectedService(e.target.value); setSelectedTime(''); }}
              className="w-full rounded-sm border border-border bg-card p-4 font-body text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="">Selecione um serviço</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} — R$ {s.price}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-body text-xs tracking-wider uppercase text-muted-foreground">Data</label>
            <input
              type="date"
              min={minDate}
              max={maxDate}
              value={selectedDate}
              onChange={e => { setSelectedDate(e.target.value); setSelectedTime(''); }}
              className="w-full rounded-sm border border-border bg-card p-4 font-body text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          {availableSlots.length > 0 && (
            <div>
              <label className="mb-2 block font-body text-xs tracking-wider uppercase text-muted-foreground">Horário</label>
              <div className="grid grid-cols-4 gap-2">
                {availableSlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`rounded-sm border p-3 font-body text-sm transition-all ${
                      selectedTime === slot
                        ? 'border-primary bg-primary/20 text-primary glow-gold'
                        : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedDate && availableSlots.length === 0 && (
            <p className="text-center font-body text-sm text-muted-foreground">
              Sem horários disponíveis nesta data.
            </p>
          )}

          <div>
            <label className="mb-2 block font-body text-xs tracking-wider uppercase text-muted-foreground">Seu Nome</label>
            <input
              type="text"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              placeholder="Nome completo"
              className="w-full rounded-sm border border-border bg-card p-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-body text-xs tracking-wider uppercase text-muted-foreground">WhatsApp</label>
            <input
              type="tel"
              value={clientPhone}
              onChange={e => setClientPhone(formatWhatsApp(e.target.value))}
              placeholder="(54) 9 9999-9999"
              className="w-full rounded-sm border border-border bg-card p-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-body text-xs tracking-wider uppercase text-muted-foreground">Confirme seu WhatsApp</label>
            <input
              type="tel"
              value={confirmPhone}
              onChange={e => setConfirmPhone(formatWhatsApp(e.target.value))}
              placeholder="(54) 9 9999-9999"
              className="w-full rounded-sm border border-border bg-card p-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-sm bg-gradient-gold py-4 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:scale-[1.02] glow-gold"
          >
            Confirmar Agendamento
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default BookingSystem;
