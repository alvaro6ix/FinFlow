import { saveAs } from 'file-saver';

/**
 * Exporta los gastos a formato CSV compatible con Excel.
 * Cumple con el requerimiento 11.1 (Exportar a CSV).
 */
export const exportToCSV = (expenses) => {
  if (!expenses || expenses.length === 0) {
    console.warn("No hay datos para exportar");
    return;
  }

  const headers = ['Fecha', 'Monto', 'Categoría', 'Descripción', 'Emoción', 'Tipo'];
  
  const rows = expenses.map(exp => [
    new Date(exp.date).toLocaleDateString(),
    exp.amount,
    exp.categoryName || 'Sin categoría',
    exp.description || '',
    exp.emotion || 'neutral',
    exp.isImpulse ? 'Impulso' : 'Planificado'
  ]);

  // BOM para que Excel detecte UTF-8 correctamente (acentos y emojis)
  let csvContent = "\uFEFF"; 
  csvContent += headers.join(',') + '\n';
  
  rows.forEach(row => {
    // Escapamos los campos con comillas para evitar errores con comas en la descripción
    csvContent += row.map(field => `"${field}"`).join(',') + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `FinFlow_Reporte_${new Date().toISOString().split('T')[0]}.csv`);
};

/**
 * Exporta todos los datos del usuario para respaldo.
 * Cumple con el requerimiento 11.2 (Respaldo y Restauración).
 */
export const exportToJSON = (data) => {
  if (!data) return;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  saveAs(blob, `FinFlow_Backup_${Date.now()}.json`);
};