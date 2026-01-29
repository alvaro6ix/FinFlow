export const SYSTEM_CATEGORIES = [
  { id: 'food', label: 'Alimentación', icon: '🍕', color: '#ef4444', defaultType: 'necesidad', subcategories: ['Comida', 'Supermercado', 'Cafetería'] },
  { id: 'transport', label: 'Transporte', icon: '🚗', color: '#3b82f6', defaultType: 'necesidad', subcategories: ['Gasolina', 'Taxi/Uber', 'Transporte público'] },
  { id: 'housing', label: 'Vivienda', icon: '🏠', color: '#10b981', defaultType: 'necesidad', subcategories: ['Renta', 'Servicios', 'Mantenimiento'] },
  { id: 'entertainment', label: 'Entretenimiento', icon: '🎬', color: '#f59e0b', defaultType: 'deseo', subcategories: ['Streaming', 'Videojuegos', 'Eventos'] },
  { id: 'health', label: 'Salud', icon: '💊', color: '#ec4899', defaultType: 'necesidad', subcategories: ['Medicinas', 'Doctor', 'Gym'] },
  { id: 'education', label: 'Educación', icon: '📚', color: '#8b5cf6', defaultType: 'necesidad', subcategories: ['Libros', 'Cursos', 'Colegiatura'] },
  { id: 'shopping', label: 'Compras', icon: '👕', color: '#6366f1', defaultType: 'deseo', subcategories: ['Ropa', 'Electrónicos', 'Regalos'] },
  { id: 'others', label: 'Otros', icon: '💰', color: '#94a3b8', defaultType: 'deseo', subcategories: ['Otros'] },
];

export const EMOTIONS = [
  { id: 'happy', label: 'Feliz', icon: '😊', impact: 'positive' },
  { id: 'sad', label: 'Triste', icon: '😢', impact: 'impulse' },
  { id: 'stressed', label: 'Estresado', icon: '😫', impact: 'impulse' },
  { id: 'neutral', label: 'Neutral', icon: '😐', impact: 'neutral' },
  { id: 'excited', label: 'Emocionado', icon: '🤩', impact: 'impulse' },
];

export const PURCHASE_TYPES = [
  { id: 'need', label: 'Necesidad', description: 'Algo indispensable' },
  { id: 'impulse', label: 'Impulso', description: 'No estaba planeado' },
  { id: 'planned', label: 'Planificado', description: 'Compra analizada' },
];