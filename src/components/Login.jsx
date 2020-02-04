import React, { useState } from 'react'
import { postLogin } from '../store/actions'
import { useDispatch } from 'react-redux'

const values = {
    username: '',
    password: ''
}
const Login = (props) => {
    const dispatch = useDispatch()
    const [creds, setCreds] = useState(values)
    const handleChange = (e) => {
        setCreds({...creds, [e.target.name]: e.target.value})
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(postLogin(creds, props.history))
        setCreds(values)
    }
    return (
        <form onSubmit={handleSubmit}>
            <input name='username' value={creds.username} onChange={handleChange}></input>
            <input name='password' value={creds.password} onChange={handleChange}></input>
        </form>
    )
}

export default Login