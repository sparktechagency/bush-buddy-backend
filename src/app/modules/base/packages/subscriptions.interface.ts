export interface ISubscription {
  title: string;
  description: string;
  amount: number;
  features: [
    {
      title: string;
      active: boolean;
    },
  ];
  duration: "monthly" | "yearly";
  services: string[];
  type: "basic" | "premium" | "advanced";
  status: "active" | "closed";
  isDeleted: boolean;
}
