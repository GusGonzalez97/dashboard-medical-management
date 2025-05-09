export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
    appointments: '/dashboard/appointments',
    calendar: '/dashboard/appointments/calendar',
    customerAppointments:'/dashboard/customers/[customerId]/appointments',
    stats:'/dashboard/stats'
  },
  errors: { notFound: '/errors/not-found' },
} as const;

export const pathsForUniqueScreen = [`${paths.dashboard.customers}/`,`${paths.dashboard.integrations}/`,paths.dashboard.calendar]