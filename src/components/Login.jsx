import React, { useState } from 'react'
import { postLogin, postRegistration } from '../store/actions'
import { useDispatch } from 'react-redux'

const values = {
    username: '',
    password: ''
}
const Login = (props) => {
    const dispatch = useDispatch()
    const [creds, setCreds] = useState(values)
    // const = [button, setButton] = useState()
    const handleChange = (e) => {
        setCreds({...creds, [e.target.name]: e.target.value})
    }
    const handleSubmit = (e) => {
        console.log(e.target.name)
        e.preventDefault()
        e.target.name === 'register' ? dispatch(postRegistration(creds, props.history)) : dispatch(postLogin(creds, props.history))
        setCreds(values)
    }
    return (
        <div>
            <form>
                <input name='username' value={creds.username} onChange={handleChange}></input>
                <input name='password' value={creds.password} onChange={handleChange}></input>
                <button name='register' onClick={handleSubmit}>Register</button>
                <button name='login' onClick={handleSubmit}>Login</button>
            </form>
        </div>
    )
}

export default Login