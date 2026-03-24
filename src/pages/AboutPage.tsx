import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutPage = () => (
  <div className="min-h-screen px-6 py-24">
    <div className="mx-auto max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <p className="mb-3 font-body text-xs tracking-[0.3em] uppercase text-primary">Sobre Nós</p>
        <h1 className="mb-8 font-display text-5xl font-light text-gradient-gold md:text-6xl">Nossa História</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-8"
      >
        <div className="rounded-sm border border-border bg-card p-8">
          <h2 className="mb-4 font-display text-2xl text-primary">Excelência desde o Primeiro Dia</h2>
          <p className="font-body text-sm leading-relaxed text-muted-foreground">
            Nascemos da paixão por transformar a autoestima através da beleza. Cada detalhe do nosso espaço foi pensado 
            para proporcionar uma experiência única — desde a ambientação sofisticada até a seleção criteriosa dos 
            melhores produtos e profissionais do mercado.
          </p>
        </div>

        <div className="rounded-sm border border-border bg-card p-8">
          <h2 className="mb-4 font-display text-2xl text-primary">Nosso Compromisso</h2>
          <p className="font-body text-sm leading-relaxed text-muted-foreground">
            Trabalhamos exclusivamente com marcas premium e técnicas avançadas. Nossa equipe passa por treinamentos 
            constantes para garantir que cada cliente receba o tratamento mais moderno e eficaz disponível. 
            Aqui, você não é apenas uma cliente — é uma convidada especial.
          </p>
        </div>

        <div className="rounded-sm border border-border bg-card p-8">
          <h2 className="mb-4 font-display text-2xl text-primary">Diferenciais</h2>
          <ul className="space-y-3">
            {[
              'Atendimento personalizado e exclusivo',
              'Produtos premium de marcas internacionais',
              'Ambiente sofisticado e acolhedor',
              'Profissionais altamente qualificados',
              'Agendamento online 24 horas',
              'Consultoria de imagem inclusa',
            ].map((item, i) => (
              <li key={i} className="font-body text-sm text-muted-foreground">✦ {item}</li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <Link
            to="/quiz"
            className="inline-flex rounded-sm bg-gradient-gold px-8 py-4 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:scale-105 glow-gold"
          >
            Agende sua Experiência
          </Link>
        </div>
      </motion.div>
    </div>
  </div>
);

export default AboutPage;
