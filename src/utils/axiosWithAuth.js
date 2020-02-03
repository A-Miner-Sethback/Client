export const axiosWithAuth = () =>
{
    const key = `Bearer ${process.env.API_KEY}`

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