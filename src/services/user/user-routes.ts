const BASE_URL = '/v1/platform-user'

export const UserRoutes = {
    invite:()=> `${BASE_URL}/invite`,
    getUserProfile: ()=> `${BASE_URL}/profile`,
    getAllUsers:() => BASE_URL
}