import { 
  Utensils, ShoppingCart, Coffee, Fuel, Car, Bus, 
  Home, Lightbulb, Wrench, Film, Gamepad2, Ticket, 
  Pill, Hospital, Dumbbell, Book, Laptop, GraduationCap, 
  Shirt, Smartphone, Gift, Banknote, HelpCircle,
  Frown, Zap, Meh, Smile, Star
} from "lucide-react";

export const SYSTEM_CATEGORIES = [
  { 
    id: 'food', 
    label: 'Alimentación', 
    icon: Utensils, 
    color: '#ef4444', 
    subcategories: [
      { id: 'comida', label: 'Comida' },
      { id: 'super', label: 'Supermercado' },
      { id: 'cafe', label: 'Cafetería' }
    ] 
  },
  { 
    id: 'transport', 
    label: 'Transporte', 
    icon: Car, 
    color: '#3b82f6', 
    subcategories: [
      { id: 'gasolina', label: 'Gasolina' },
      { id: 'taxi', label: 'Taxi / Uber' },
      { id: 'publico', label: 'Transporte público' }
    ] 
  },
  { 
    id: 'housing', 
    label: 'Vivienda', 
    icon: Home, 
    color: '#10b981', 
    subcategories: [
      { id: 'renta', label: 'Renta' },
      { id: 'servicios', label: 'Servicios' },
      { id: 'mantenimiento', label: 'Mantenimiento' }
    ] 
  },
  { 
    id: 'entertainment', 
    label: 'Entretenimiento', 
    icon: Film, 
    color: '#f59e0b', 
    subcategories: [
      { id: 'streaming', label: 'Streaming' },
      { id: 'juegos', label: 'Videojuegos' },
      { id: 'eventos', label: 'Eventos' }
    ] 
  },
  { 
    id: 'health', 
    label: 'Salud', 
    icon: Pill, 
    color: '#ec4899', 
    subcategories: [
      { id: 'medicinas', label: 'Medicinas' },
      { id: 'doctor', label: 'Doctor' },
      { id: 'gym', label: 'Gym' }
    ] 
  },
  { 
    id: 'education', 
    label: 'Educación', 
    icon: Book, 
    color: '#8b5cf6', 
    subcategories: [
      { id: 'libros', label: 'Libros' },
      { id: 'cursos', label: 'Cursos' },
      { id: 'colegiatura', label: 'Colegiatura' }
    ] 
  },
  { 
    id: 'shopping', 
    label: 'Compras', 
    icon: Shirt, 
    color: '#6366f1', 
    subcategories: [
      { id: 'ropa', label: 'Ropa' },
      { id: 'electronicos', label: 'Electrónicos' },
      { id: 'regalos', label: 'Regalos' }
    ] 
  },
  { 
    id: 'others', 
    label: 'Otros', 
    icon: HelpCircle, 
    color: '#94a3b8', 
    subcategories: [
      { id: 'otros_g', label: 'Varios' }
    ] 
  },
];

export const EMOTIONS = [
  { id: 'sad', label: 'Triste', icon: Frown, color: '#3b82f6' },
  { id: 'stressed', label: 'Estresado', icon: Zap, color: '#f59e0b' },
  { id: 'neutral', label: 'Neutral', icon: Meh, color: '#94a3b8' },
  { id: 'happy', label: 'Feliz', icon: Smile, color: '#10b981' },
  { id: 'excited', label: 'Emocionado', icon: Star, color: '#8b5cf6' },
];

export const PURCHASE_TYPES = [
  { id: 'need', label: 'Necesidad' },
  { id: 'impulse', label: 'Impulso' },
  { id: 'planned', label: 'Planificado' },
];