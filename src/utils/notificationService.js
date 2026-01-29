/**
 * Servicio de notificaciones proactivas.
 * Cumple con el requerimiento 10.1.
 */
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) return;
  const permission = await Notification.requestPermission();
  return permission === "granted";
};

export const sendBudgetAlert = (categoryName, percentage) => {
  if (Notification.permission === "granted") {
    new Notification("Alerta de Presupuesto", {
      body: `Has consumido el ${percentage}% de tu presupuesto en ${categoryName}.`,
      icon: "/icon-192.png"
    });
  }
};