export interface EmployeeSession {
  id: number;
  organization: {
    id: number;
    role: 'ADMIN';
  } | null;
}
