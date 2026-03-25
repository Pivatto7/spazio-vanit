import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useServices } from '@/lib/store';

const ServicesHighlight = () => {
  const services = useServices().slice(0, 6);

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="mb-3 font-body text-xs tracking-[0.3em] uppercase text-primary">Nossos Serviços</p>
          <h2 className="font-display text-4xl font-light md:text-5xl text-gradient-gold">
            Excelência em Cada Detalhe
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative overflow-hidden rounded-sm border border-border bg-card p-8 transition-all hover:border-primary/50 hover:glow-gold"
            >
              <div className="mb-6 h-px w-12 bg-gradient-gold" />
              <h3 className="mb-3 font-display text-2xl font-medium text-foreground">{service.name}</h3>
              <p className="mb-4 font-body text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {service.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl text-primary">
                  R$ {service.price}
                </span>
                <span className="font-body text-xs text-muted-foreground">{service.duration}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            to="/servicos"
            className="inline-flex items-center border-b border-primary pb-1 font-body text-sm tracking-wider text-primary transition-all hover:border-primary/60"
          >
            Ver todos os serviços →
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesHighlight;
