import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Menu', href: paths.dashboard.overview, icon: 'home' },
  { key: 'customers', title: 'Pacientes', href: paths.dashboard.customers, icon: 'users' },
  { key: 'integrations', title: 'Historias clinicas', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  { key: 'appointments', title: 'Turnos', href: paths.dashboard.appointments, icon: 'calendar' },
  { key: 'stats', title: 'Estadísticas', href: paths.dashboard.stats, icon: 'chart-pie' },
  { key: 'account', title: 'Mi cuenta', href: paths.dashboard.account, icon: 'user' },
] satisfies NavItemConfig[];
