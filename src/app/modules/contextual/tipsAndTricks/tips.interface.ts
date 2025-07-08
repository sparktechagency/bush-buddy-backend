export interface ITips {
  title?: string;
  link: string;
  platform: "youtube" | "google" | "linkedin" | "facebook";
  isDeleted: boolean;
}
