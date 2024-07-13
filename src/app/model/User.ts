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
    roles: Role[];
  }
  