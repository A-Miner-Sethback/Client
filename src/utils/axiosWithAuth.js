import axios from 'axios'

export const axiosWithAuth = () =>
{
    const key = `Token ${process.env.REACT_APP_API_KEY}`
    return axios.create({
        headers:
        {
            'Content-Type': 'application/json',
            'Authorization': key
        }
    })
}

export const axaBE = () =>
{
    const token = localStorage.getItem('token')
    return axios.create({
        headers:
        {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
}