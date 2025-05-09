import { CalendarDots, ChartPie } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { Files, House } from '@phosphor-icons/react/dist/ssr';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';

export const navIcons = {
  'home':House,
  'chart-pie': ChartPie,
  'gear-six': GearSixIcon,
  'plugs-connected': Files,
  'x-square': XSquare,
  'calendar':CalendarDots,
  user: UserIcon,
  users: UsersIcon,
} as Record<string, Icon>;
