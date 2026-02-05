import axios from 'axios'

// Creamos una instancia para no repetir la URL base siempre
const userApi = axios.create({
  baseURL: 'http://localhost:5000/users', // Asegúrate de que este sea el puerto de tu backend
})

export const getUsersRequest = () => userApi.get('/')
export const getUserRequest = (id) => userApi.get(`/${id}`)
export const createUserRequest = (user) => userApi.post('/', user)
export const updateUserRequest = (id, newFields) => userApi.put(`/${id}`, newFields)
export const patchUserRequest = (id, fields) => userApi.patch(`/${id}`, fields)
export const deleteUserRequest = (id) => userApi.delete(`/${id}`)
export const softDeleteUserRequest = (id) => userApi.patch(`/soft/${id}`)
export const reactivateUserRequest = (id) => userApi.patch(`/reactivate/${id}`)
