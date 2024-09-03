export const EMPLOYEE_ROLES = ['OWNER', 'ADMIN'] as const;
export type EmployeeRoles = (typeof EMPLOYEE_ROLES)[number][];

export type EmployeeSession = {
  id: number;
  currentOrganization: {
    id: number;
    role: EmployeeRoles;
  } | null;
};
