import { IJobApplicationPayload } from "../jobApplication/jobApplication.interface";

export interface IJobPostPayload {
  id: string;
  title: string;
  description: string;
  requirements: string;
  location?: string | null;
  serviceType: string;
  vacancy: number;
  salaryRange?: string | null;
  deadline: Date | string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  applications?: IJobApplicationPayload[];
}

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

export interface IJobPostUpdatePayload {
  title?: string;
  description?: string;
  requirements?: string;
  location?: string;
  serviceType?: string;
  vacancy?: number;
  salaryRange?: string;
  deadline: Date;
  isActive?: boolean;
}

export interface IJobPostDeletePayload {
  id?: string;
  isActive: boolean;
}
