export const DEFAULT_CATEGORIES = [
  {
    id: 'food',
    name: 'Alimentación',
    icon: '🍕',
    color: '#f59e0b',
    subcategories: [
      { id: 'restaurant', name: 'Comida', icon: '🍕' },
      { id: 'grocery', name: 'Supermercado', icon: '🛒' },
      { id: 'cafe', name: 'Cafetería', icon: '☕' },
    ],
  },
  {
    id: 'transport',
    name: 'Transporte',
    icon: '🚗',
    color: '#3b82f6',
    subcategories: [
      { id: 'gas', name: 'Gasolina', icon: '⛽' },
      { id: 'taxi', name: 'Taxi/Uber', icon: '🚕' },
      { id: 'public', name: 'Transporte público', icon: '🚌' },
    ],
  },
  {
    id: 'home',
    name: 'Vivienda',
    icon: '🏠',
    color: '#8b5cf6',
    subcategories: [
      { id: 'rent', name: 'Renta', icon: '🏠' },
      { id: 'utilities', name: 'Servicios', icon: '💡' },
      { id: 'maintenance', name: 'Mantenimiento', icon: '🔧' },
    ],
  },
  {
    id: 'entertainment',
    name: 'Entretenimiento',
    icon: '🎬',
    color: '#ec4899',
    subcategories: [
      { id: 'streaming', name: 'Streaming', icon: '🎬' },
      { id: 'games', name: 'Videojuegos', icon: '🎮' },
      { id: 'events', name: 'Eventos', icon: '🎭' },
    ],
  },
  {
    id: 'health',
    name: 'Salud',
    icon: '💊',
    color: '#10b981',
    subcategories: [
      { id: 'medicine', name: 'Medicinas', icon: '💊' },
      { id: 'doctor', name: 'Doctor', icon: '🏥' },
      { id: 'gym', name: 'Gym', icon: '💪' },
    ],
  },
  {
    id: 'education',
    name: 'Educación',
    icon: '📚',
    color: '#06b6d4',
    subcategories: [
      { id: 'books', name: 'Libros', icon: '📚' },
      { id: 'courses', name: 'Cursos', icon: '💻' },
      { id: 'tuition', name: 'Colegiatura', icon: '🎓' },
    ],
  },
  {
    id: 'shopping',
    name: 'Compras',
    icon: '👕',
    color: '#f43f5e',
    subcategories: [
      { id: 'clothes', name: 'Ropa', icon: '👕' },
      { id: 'electronics', name: 'Electrónicos', icon: '📱' },
      { id: 'gifts', name: 'Regalos', icon: '🎁' },
    ],
  },
  {
    id: 'other',
    name: 'Otros',
    icon: '💰',
    color: '#64748b',
    subcategories: [],
  },
];

export const PAYMENT_METHODS = [
  { id: 'cash', name: 'Efectivo', icon: '💵' },
  { id: 'card', name: 'Tarjeta', icon: '💳' },
  { id: 'transfer', name: 'Transferencia', icon: '🏦' },
  { id: 'other', name: 'Otro', icon: '💰' },
];

export const EXPENSE_REASONS = [
  { id: 'need', name: 'Necesidad', icon: '✅', color: 'success' },
  { id: 'planned', name: 'Planificado', icon: '📋', color: 'info' },
  { id: 'impulse', name: 'Impulso', icon: '⚡', color: 'warning' },
];

export const EXPENSE_EMOTIONS = [
  { id: 'happy', name: 'Feliz', icon: '😊' },
  { id: 'sad', name: 'Triste', icon: '😢' },
  { id: 'stressed', name: 'Estresado', icon: '😰' },
  { id: 'neutral', name: 'Neutral', icon: '😐' },
  { id: 'excited', name: 'Emocionado', icon: '🤩' },
];

export const RECURRENCE_FREQUENCIES = [
  { id: 'daily', name: 'Diario', value: 1 },
  { id: 'weekly', name: 'Semanal', value: 7 },
  { id: 'biweekly', name: 'Quincenal', value: 15 },
  { id: 'monthly', name: 'Mensual', value: 30 },
  { id: 'yearly', name: 'Anual', value: 365 },
];

export const CURRENCIES = [
  { code: 'MXN', symbol: '$', name: 'Peso Mexicano' },
  { code: 'USD', symbol: '$', name: 'Dólar Estadounidense' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'Libra Esterlina' },
];

export const DATE_FORMATS = [
  { id: 'DD/MM/YYYY', label: '31/12/2024' },
  { id: 'MM/DD/YYYY', label: '12/31/2024' },
  { id: 'YYYY-MM-DD', label: '2024-12-31' },
];

export const BUDGET_PERIODS = [
  { id: 'weekly', name: 'Semanal' },
  { id: 'monthly', name: 'Mensual' },
  { id: 'yearly', name: 'Anual' },
];