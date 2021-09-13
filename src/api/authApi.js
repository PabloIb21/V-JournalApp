import axios from 'axios'

const authApi = axios.create({
    baseURL: 'https://identitytoolkit.googleapis.com/v1/accounts',
    params: {
        key: process.env.VUE_APP_API_KEY
    }
})

export default authApi