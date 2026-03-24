import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = '5511999999999';
  const message = encodeURIComponent('Olá! Vi o site e gostaria de mais informações.');
  const url = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-gold px-5 py-3 font-body text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl glow-gold"
      aria-label="Fale conosco no WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
};

export default WhatsAppButton;
