/* eslint-disable @typescript-eslint/no-explicit-any */
import { JobApplicationStatus } from "../../../generated/prisma/enums";

export interface IJobApplicationPayload {
  userId: string;
  jobPostId?: string | null;
  cvUrl: string;
  status?: "PENDING" | "ACCEPTED" | "REJECTED";
  feedback?: string | null;
}

export interface IUpdateJobApplicationPayload {
  status: JobApplicationStatus;
  [key: string]: any;
}
