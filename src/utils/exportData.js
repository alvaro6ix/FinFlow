import { saveAs } from 'file-saver';

export const exportToCSV = (expenses, categories) => {
  if (!expenses || expenses.length === 0) return;

  const headers = ['Fecha', 'Monto', 'Categoría', 'Descripción', 'Emoción', 'Tipo'];
  const rows = expenses.map(exp => [
    new Date(exp.date).toLocaleDateString(),
    exp.amount,
    exp.categoryName || 'Sin categoría',
    exp.description || '',
    exp.emotion || 'neutral',
    exp.isImpulse ? 'Impulso' : 'Planificado'
  ]);

  let csvContent = "\uFEFF"; // BOM para Excel
  csvContent += headers.join(',') + '\n';
  rows.forEach(row => {
    csvContent += row.map(field => `"${field}"`).join(',') + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `FinFlow_Reporte_${new Date().toISOString().split('T')[0]}.csv`);
};

export const exportToJSON = (data) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  saveAs(blob, `FinFlow_Backup_${Date.now()}.json`);
};