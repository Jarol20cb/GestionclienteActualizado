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
  accountType: string; // Tipo de cuenta: "free" o "premium"
  createdAt: string; // Fecha de creación
  premiumStartDate?: string; // Fecha de inicio del plan premium
  lastPaymentDate?: string; // Fecha del último pago
  timeUntilNextPayment?: number; // Tiempo restante hasta el próximo pago
  accountStatus: string; // Nuevo campo para el estado de la cuenta: "activo", "pendiente", "vencido"
  roles: Role[];
}
