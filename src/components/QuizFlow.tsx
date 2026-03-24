import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getServices } from '@/lib/store';
import type { QuizAnswer } from '@/lib/types';

const questions = [
  {
    key: 'hairType' as const,
    question: 'Qual é o tipo do seu cabelo?',
    options: ['Liso', 'Ondulado', 'Cacheado', 'Crespo'],
  },
  {
    key: 'goal' as const,
    question: 'Qual é o seu principal objetivo?',
    options: ['Mudar a cor', 'Cortar e renovar', 'Tratar e recuperar', 'Preparar para evento'],
  },
  {
    key: 'concern' as const,
    question: 'Qual sua maior preocupação com o cabelo?',
    options: ['Ressecamento', 'Frizz e volume', 'Fios quebradiços', 'Falta de brilho'],
  },
  {
    key: 'budget' as const,
    question: 'Qual sua faixa de investimento?',
    options: ['Até R$ 200', 'R$ 200 - R$ 400', 'R$ 400 - R$ 600', 'Acima de R$ 600'],
  },
];

function getRecommendation(answers: QuizAnswer) {
  const services = getServices();
  if (answers.goal === 'Mudar a cor') {
    return answers.budget === 'Até R$ 200' || answers.budget === 'R$ 200 - R$ 400'
      ? services.find(s => s.id === '1')!
      : services.find(s => s.id === '2')!;
  }
  if (answers.goal === 'Cortar e renovar') return services.find(s => s.id === '3')!;
  if (answers.goal === 'Tratar e recuperar') return services.find(s => s.id === '4')!;
  if (answers.goal === 'Preparar para evento') return services.find(s => s.id === '6')!;
  return services[0];
}

const QuizFlow = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswer>>({});
  const [showResult, setShowResult] = useState(false);
  const navigate = useNavigate();

  const handleAnswer = (value: string) => {
    const key = questions[step].key;
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  };

  const recommendation = showResult ? getRecommendation(answers as QuizAnswer) : null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-8">
              <div className="mb-4 flex gap-2">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      i <= step ? 'bg-gradient-gold' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <p className="font-body text-xs text-muted-foreground">
                Pergunta {step + 1} de {questions.length}
              </p>
            </div>

            <h2 className="mb-8 font-display text-3xl font-light md:text-4xl text-foreground">
              {questions[step].question}
            </h2>

            <div className="grid gap-3">
              {questions[step].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className="rounded-sm border border-border bg-card p-5 text-left font-body text-sm text-foreground transition-all hover:border-primary hover:bg-primary/5 hover:glow-gold"
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="mb-6 h-px w-16 mx-auto bg-gradient-gold" />
            <p className="mb-3 font-body text-xs tracking-[0.3em] uppercase text-primary">
              Seu Serviço Ideal
            </p>
            <h2 className="mb-6 font-display text-4xl font-light md:text-5xl text-gradient-gold">
              {recommendation?.name}
            </h2>
            <p className="mx-auto mb-8 max-w-lg font-body text-sm leading-relaxed text-muted-foreground">
              {recommendation?.description}
            </p>

            <div className="mx-auto mb-8 max-w-md rounded-sm border border-border bg-card p-6">
              <h4 className="mb-4 font-body text-xs tracking-[0.2em] uppercase text-primary">Benefícios</h4>
              <ul className="space-y-2">
                {recommendation?.benefits.map((b, i) => (
                  <li key={i} className="font-body text-sm text-muted-foreground">✦ {b}</li>
                ))}
              </ul>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <span className="font-body text-xs text-muted-foreground">Duração: {recommendation?.duration}</span>
                <span className="font-display text-2xl text-primary">R$ {recommendation?.price}</span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/agendamento?service=${recommendation?.id}`)}
              className="inline-flex items-center rounded-sm bg-gradient-gold px-8 py-4 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:scale-105 glow-gold"
            >
              Agendar Agora
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizFlow;
