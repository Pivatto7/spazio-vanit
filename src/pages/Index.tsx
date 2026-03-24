import HeroSection from '@/components/HeroSection';
import ServicesHighlight from '@/components/ServicesHighlight';
import TestimonialsSection from '@/components/TestimonialsSection';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div>
      <HeroSection />
      <ServicesHighlight />

      {/* About Preview */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="mb-3 font-body text-xs tracking-[0.3em] uppercase text-primary">Sobre o Salão</p>
            <h2 className="mb-6 font-display text-4xl font-light md:text-5xl text-gradient-gold">
              Onde a Beleza Encontra a Excelência
            </h2>
            <p className="mx-auto mb-8 max-w-2xl font-body text-sm leading-relaxed text-muted-foreground">
              Mais do que um salão, somos um espaço de transformação. Com profissionais altamente qualificados 
              e produtos premium, cada visita é uma experiência única de cuidado e sofisticação.
            </p>
            <Link
              to="/sobre"
              className="inline-flex border-b border-primary pb-1 font-body text-sm tracking-wider text-primary"
            >
              Conheça nossa história →
            </Link>
          </motion.div>
        </div>
      </section>

      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="mb-6 font-display text-4xl font-light md:text-5xl text-gradient-gold">
              Pronta para se Transformar?
            </h2>
            <p className="mx-auto mb-8 max-w-lg font-body text-sm leading-relaxed text-muted-foreground">
              Faça nosso quiz interativo e descubra o serviço perfeito para você. 
              É rápido, fácil e personalizado.
            </p>
            <Link
              to="/quiz"
              className="inline-flex rounded-sm bg-gradient-gold px-8 py-4 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:scale-105 glow-gold"
            >
              Começar Agora
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <p className="font-display text-lg tracking-wider text-gradient-gold">SPAZIO VANITÀ</p>
          <p className="font-body text-xs text-muted-foreground">© 2026 Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
