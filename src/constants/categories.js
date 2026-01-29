// Exportamos como SYSTEM_CATEGORIES y añadimos un alias DEFAULT_CATEGORIES 
// para evitar errores en otros componentes que aún usen el nombre anterior.
export const SYSTEM_CATEGORIES = [
  { id: 'food', label: 'Alimentación', icon: '🍕', color: '#ef4444', defaultType: 'necesidad' },
  { id: 'transport', label: 'Transporte', icon: '🚗', color: '#3b82f6', defaultType: 'necesidad' },
  { id: 'housing', label: 'Vivienda', icon: '🏠', color: '#10b981', defaultType: 'necesidad' },
  { id: 'entertainment', label: 'Entretenimiento', icon: '🎬', color: '#f59e0b', defaultType: 'deseo' },
  { id: 'health', label: 'Salud', icon: '💊', color: '#ec4899', defaultType: 'necesidad' },
  { id: 'education', label: 'Educación', icon: '📚', color: '#8b5cf6', defaultType: 'necesidad' },
  { id: 'shopping', label: 'Compras', icon: '👕', color: '#6366f1', defaultType: 'deseo' },
  { id: 'others', label: 'Otros', icon: '💰', color: '#94a3b8', defaultType: 'deseo' },
];

export const DEFAULT_CATEGORIES = SYSTEM_CATEGORIES;

export const EMOTIONS = [
  { id: 'happy', label: 'Feliz', icon: '😊' },
  { id: 'sad', label: 'Triste', icon: '😢' },
  { id: 'stressed', label: 'Estresado', icon: '😫' },
  { id: 'neutral', label: 'Neutral', icon: '😐' },
  { id: 'excited', label: 'Emocionado', icon: '🤩' },
];