import { RolesEnum } from "@/types/enum/roles.enum";
import {type  PlatformUserI } from "@/types/user";

const platformUserMock = {
    id: 'USR-2025',
    name: 'Daniel',
    lastName: 'Slikerman',
    email: 'daniel@devias.io',
    phoneNumber:'297423123121',
    roles: [RolesEnum.ADMIN],
    
  } satisfies PlatformUserI;

export default platformUserMock