import { Role } from "../api/enums";
import { store } from "../store";

export const hasPermission = (allowedUserRoles: Role[]): boolean => {
  const userRole = store?.getState()?.user.profile.role as Role ;
  return !!userRole && allowedUserRoles.includes(userRole);
};  