export interface IJobApplicationPayload {
  userId: string;
  jobPostId?: string | null;
  cvUrl: string;
  status?: "PENDING" | "ACCEPTED" | "REJECTED";
  feedback?: string | null;
}
