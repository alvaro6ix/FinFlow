import { saveAs } from 'file-saver';

export const exportToCSV = (expenses) => {
  if (!expenses || expenses.length === 0) return;

  const headers = ['Fecha', 'Monto', 'Categoría', 'Descripción', 'Emoción', 'Tipo'];
  const rows = expenses.map(exp => [
    new Date(exp.date).toLocaleDateString('es-MX'),
    exp.amount,
    exp.categoryName || 'Sin categoría',
    exp.description || '',
    exp.emotion || 'neutral',
    exp.isImpulse ? 'Impulso' : 'Planificado'
  ]);

  let csvContent = "\uFEFF" + headers.join(',') + '\n';
  rows.forEach(row => {
    csvContent += row.map(field => `"${field}"`).join(',') + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  // Nombre de archivo normalizado
  const dateStr = new Date().toISOString().split('T')[0];
  saveAs(blob, `FinFlow_Gastos_${dateStr}.csv`);
};

export const exportFullBackupJSON = (data) => {
  if (!data) return;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const dateStr = new Date().toISOString().split('T')[0];
  saveAs(blob, `FinFlow_Respaldo_Total_${dateStr}.json`);
};