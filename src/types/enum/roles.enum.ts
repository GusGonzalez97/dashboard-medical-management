
export enum RolesEnum {
    User = 'user',
    ADMIN = 'admin',
    DOCTOR = 'doctor',
    Receptionist = 'receptionist',
  }
  

export const RoleLabel = {
    [RolesEnum.ADMIN]: 'Administrador',
    [RolesEnum.Receptionist]: 'Recepcionista',
    [RolesEnum.DOCTOR]: 'Doctor'
}