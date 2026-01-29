// Exportar a CSV
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    console.error('No hay datos para exportar');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  csvRows.push(headers.join(','));
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      const escaped = ('' + value).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
};

// Exportar gastos a CSV
export const exportExpensesToCSV = (expenses, filename = 'gastos.csv') => {
  const formattedData = expenses.map(expense => ({
    Fecha: expense.date,
    Monto: expense.amount,
    Categoría: expense.categoryId,
    Descripción: expense.description || '',
    'Método de pago': expense.paymentMethod || '',
  }));
  
  exportToCSV(formattedData, filename);
};

// Exportar a JSON
export const exportToJSON = (data, filename = 'export.json') => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  downloadBlob(blob, filename);
};

// Función auxiliar para descargar blob
const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};