export class UserWithDates {
    id: number = 0;
    username: string = "";
    password: string = "";
    roles: string[] = [];
    name: string = ""; 
    companyName: string = ""; 
    accountType: 'FREE' | 'PREMIUM' = 'FREE';
    isPremium: boolean = false;
    lastPaymentDate: Date;
    createdAt: Date;
    subscriptionStartDate: Date;
    subscriptionEndDate: Date;

    constructor(data: any) {
        this.id = data.id;
        this.username = data.username;
        this.password = data.password;
        this.roles = data.roles;
        this.name = data.name;
        this.companyName = data.companyName;
        this.accountType = data.accountType;
        this.isPremium = data.isPremium;

        // Convertir las cadenas de fecha a objetos Date
        this.lastPaymentDate = new Date(data.lastPaymentDate);
        this.createdAt = new Date(data.createdAt);
        this.subscriptionStartDate = new Date(data.subscriptionStartDate);
        this.subscriptionEndDate = new Date(data.subscriptionEndDate);
    }
}
