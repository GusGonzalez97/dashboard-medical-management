const BASE_URL = '/v1/auth'

export const AuthRoutes = {
    login:()=> `${BASE_URL}/login`,
    logout: ()=> `${BASE_URL}/logout`,
    changePassword:() => `${BASE_URL}/change-password`,
    forgotPassword:() => `${BASE_URL}/forgot-password`,
    refreshToken:()=> `${BASE_URL}/refresh`
}