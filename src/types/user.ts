import { type RolesEnum } from "./enum/roles.enum";


export interface PlatformUserI{
  id?:string;
  name:string;
  lastName:string;
  roles:RolesEnum[];
  email:string;
  phoneNumber:string;
  proyectId?:string;
  createdAt?:string;
  updatedAt?:string
}

