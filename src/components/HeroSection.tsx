import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-salon.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="Salão de beleza premium" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-4 font-body text-xs tracking-[0.3em] uppercase text-primary">
            Experiência Premium em Beleza
          </p>
          <h1 className="mb-6 font-display text-5xl font-light leading-tight md:text-7xl lg:text-8xl">
            <span className="text-gradient-gold">Beleza</span> que{' '}
            <span className="italic text-foreground">Transforma</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl font-body text-base font-light leading-relaxed text-muted-foreground md:text-lg">
            Descubra o serviço ideal para você e agende com exclusividade.
            Seu momento de transformação começa aqui.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            to="/quiz"
            className="inline-flex items-center rounded-sm bg-gradient-gold px-8 py-4 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:scale-105 hover:shadow-lg glow-gold"
          >
            Descobrir meu serviço ideal
          </Link>
          <Link
            to="/servicos"
            className="inline-flex items-center rounded-sm border border-primary/40 px-8 py-4 font-body text-sm font-medium uppercase tracking-widest text-primary transition-all hover:border-primary hover:bg-primary/10"
          >
            Conhecer serviços
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="h-12 w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
