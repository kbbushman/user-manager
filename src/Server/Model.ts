export interface Account {
  username: string;
  password: string;
}

export interface Handler {
  handleRequest(): void;
}
