export class Message {
  id: number = 0;
  username: string = '';
  title: string = '';
  fileData: string = '';
  createdAt: Date = new Date();
  status: string = 'PENDING'; // Nuevo campo para el estado

  constructor(init?: Partial<Message>) {
    Object.assign(this, init);
  }
}
