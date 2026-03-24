export interface IJobPostCreatePayload {
  title: string;
  description: string;
  requirements: string;
  location?: string;
  serviceType: string;
  vacancy?: number;
  salaryRange?: string;
  deadline: Date;
  isActive?: boolean;
}
