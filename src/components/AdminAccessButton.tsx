import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

const AdminAccessButton = () => (
  <Link
    to="/admin"
    className="fixed bottom-6 left-6 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-border/30 bg-background/60 text-muted-foreground/30 backdrop-blur-sm transition-all hover:border-primary/40 hover:text-primary/60"
    aria-label="Painel administrativo"
  >
    <Settings className="h-4 w-4" />
  </Link>
);

export default AdminAccessButton;
