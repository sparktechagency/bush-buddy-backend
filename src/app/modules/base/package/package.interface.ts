export interface IPackage {
  title: string;
  description: string;
  amount: number;
  features: [
    {
      title: string;
    },
  ];
  duration: "monthly" | "yearly";
  services: string[];
  type: "basic" | "premium" | "advanced";
  status: "active" | "closed";
  isDelete: boolean;
}
