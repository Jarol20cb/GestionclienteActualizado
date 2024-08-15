export interface Role {
  id: number;
  rol: string;
  userId: number;
}

export interface User {
  id: number;
  username: string;
  password?: string;
  enabled: boolean;
  name: string;
  companyName: string;
  accountType: 'FREE' | 'PREMIUM'; // Tipo de cuenta: "FREE" o "PREMIUM"
  createdAt: string; // Fecha de creación de la cuenta
  subscriptionStartDate: string; // Fecha de inicio de la suscripción (free o premium)
  subscriptionEndDate: string; // Fecha de finalización de la suscripción
  lastPaymentDate?: string; // Fecha del último pago (solo para usuarios premium)
  isPremium: boolean; // Indica si la cuenta es premium (true/false)
  roles: Role[]; // Roles asociados al usuario
}
