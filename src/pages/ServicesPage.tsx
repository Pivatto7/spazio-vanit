import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getServices } from '@/lib/store';

const ServicesPage = () => {
  const services = getServices();
  const categories = [...new Set(services.map(s => s.category))];

  return (
    <div className="min-h-screen px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center">
          <p className="mb-3 font-body text-xs tracking-[0.3em] uppercase text-primary">Nossos Serviços</p>
          <h1 className="mb-4 font-display text-5xl font-light text-gradient-gold md:text-6xl">Serviços Premium</h1>
          <p className="mx-auto max-w-lg font-body text-sm leading-relaxed text-muted-foreground">
            Cada serviço é executado com excelência, usando produtos de alta performance e técnicas avançadas.
          </p>
        </motion.div>

        {categories.map((cat, ci) => (
          <div key={cat} className="mb-16">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-8 font-display text-2xl text-primary"
            >
              {cat}
            </motion.h2>
            <div className="space-y-6">
              {services.filter(s => s.category === cat).map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-sm border border-border bg-card p-8 transition-all hover:border-primary/30"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div className="flex-1">
                      <h3 className="mb-3 font-display text-2xl text-foreground">{service.name}</h3>
                      <p className="mb-4 font-body text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                      <div className="mb-4 grid gap-2 sm:grid-cols-2">
                        {service.benefits.map((b, j) => (
                          <p key={j} className="font-body text-xs text-muted-foreground">✦ {b}</p>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-display text-3xl text-primary">R$ {service.price}</span>
                      <span className="font-body text-xs text-muted-foreground">{service.duration}</span>
                      <Link
                        to={`/agendamento?service=${service.id}`}
                        className="mt-2 rounded-sm bg-gradient-gold px-6 py-2 font-body text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:scale-105"
                      >
                        Agendar
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-16 text-center">
          <p className="mb-4 font-body text-sm text-muted-foreground">Não sabe qual serviço é ideal para você?</p>
          <Link to="/quiz" className="inline-flex rounded-sm border border-primary px-8 py-3 font-body text-sm uppercase tracking-widest text-primary transition-all hover:bg-primary/10">
            Fazer o Quiz →
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ServicesPage;
