export class Message {
  id: number = 0;
  userId: number = 0;
  title: string = '';
  fileData: string = '';
  createdAt: Date = new Date();

  constructor(init?: Partial<Message>) {
    Object.assign(this, init);
  }
}
