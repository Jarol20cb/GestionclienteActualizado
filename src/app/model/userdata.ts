export class UserData {
    id: number = 0;
    username: string = "";
    password: string = "";
    roles: string[] = [];
    name: string = ""; 
    companyName: string = ""; 
    accountType: 'FREE' | 'PREMIUM' = 'FREE';
    isPremium: boolean = false;
    lastPaymentDate: Date = new Date();
    createdAt: Date = new Date();
    subscriptionStartDate: Date = new Date();
    subscriptionEndDate: Date = new Date();
    number: string = "";
  }