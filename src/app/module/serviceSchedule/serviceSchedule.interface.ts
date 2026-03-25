export interface IServiceCreatePayload {
  name: string;
  description: string;
  imageUrl?: string | null;
  isActive?: boolean;
}
