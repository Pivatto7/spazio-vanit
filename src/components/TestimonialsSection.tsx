import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { getTestimonials } from '@/lib/store';

const TestimonialsSection = () => {
  const testimonials = getTestimonials();

  return (
    <section className="py-24 px-6 bg-card/50">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="mb-3 font-body text-xs tracking-[0.3em] uppercase text-primary">Depoimentos</p>
          <h2 className="font-display text-4xl font-light md:text-5xl text-gradient-gold">
            O Que Nossas Clientes Dizem
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-sm border border-border bg-card p-8"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="mb-6 font-body text-sm italic leading-relaxed text-muted-foreground">
                "{t.text}"
              </p>
              <div>
                <p className="font-body text-sm font-semibold text-foreground">{t.name}</p>
                <p className="font-body text-xs text-primary">{t.service}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
