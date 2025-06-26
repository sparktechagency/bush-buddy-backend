export interface ISubscription {
  title: string;
  description: string;
  amount: number;
  services: string[];
  type: "basic" | "advanced";
  status: "active" | "closed";
  isDelete: boolean;
}
