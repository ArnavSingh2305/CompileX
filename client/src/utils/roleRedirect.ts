
export type UserRole = "user" | "admin" | "teacher";

export const getDashboardPath = (role: UserRole): string => {
  switch (role) {
    case "admin":
      return "/admin/dashboard";

    case "teacher":
      return "/teacher/dashboard";

    case "user":
    default:
      return "/dashboard";
  }
};
