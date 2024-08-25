export class Registro {
  id: number = 0;
  username: string = "";
  password: string = "";
  roles: string[] = [];
  name: string = ""; 
  companyName: string = ""; 
  accountType: 'FREE' | 'PREMIUM' = 'FREE';
  number: string = "";
}

