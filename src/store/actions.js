import axios from 'axios'
import { axiosWithAuth, axaBE } from '../utils/axiosWithAuth'

export const REGISTER_USER_START = "REGISTER_USER_START"
export const REGISTER_USER_SUCCESS = "REGISTER_USER_SUCCESS"
export const REGISTER_USER_FAIL = "REGISTER_USER_FAIL"
export const LOGIN_USER_START = "LOGIN_USER_START"
export const LOGIN_USER_SUCCESS = "LOGIN_USER_SUCCESS"
export const LOGIN_USER_FAIL = "LOGIN_USER_FAIL"
export const GET_USER_ROOMS_START = "GET_USER_ROOMS_START"
export const GET_USER_ROOMS_SUCCESS = "GET_USER_ROOMS_SUCCESS"
export const GET_USER_ROOMS_FAIL = "GET_USER_ROOMS_FAIL"
export const ADD_USER_ROOM_START = "ADD_USER_ROOM_START"
export const ADD_USER_ROOM_SUCCESS = "ADD_USER_ROOM_SUCCESS"
export const ADD_USER_ROOM_FAIL = "ADD_USER_ROOM_FAIL"
export const TRAVEL_DIRECTION_START = "TRAVEL_DIRECTION_START"
export const TRAVEL_DIRECTION_SUCCESS = "TRAVEL_DIRECTION_SUCCESS"
export const TRAVEL_DIRECTION_FAIL = "TRAVEL_DIRECTION_FAIL"
export const PRAY_START = "PRAY_START"
export const PRAY_SUCCESS = "PRAY_SUCCESS"
export const PRAY_FAIL = "PRAY_FAIL"

export const postRegistration = user => dispatch =>
{
    dispatch({ type: REGISTER_USER_START })

    axios.post(`${baseURL}/api/auth/register`, user)
    .then(res =>
    {
        console.log("res from postRegistration:", res)
        localStorage.setItem(res.token)
        dispatch({ type: REGISTER_USER_SUCCESS, payload: res })
    })
    .catch(err =>
    {
        console.log("err from postRegistration:", err)
        dispatch({ type: REGISTER_USER_FAIL, payload: err })
    })
}

export const postLogin = user => dispatch =>
{
    dispatch({ type: LOGIN_USER_START })

    axiosWithAuth().post(`${baseURL}/api/auth/login`, user)
    .then(res =>
    {
        console.log("res from postLogin:", res)
        localStorage.setItem(res.token)
        dispatch({ type: LOGIN_USER_SUCCESS, payload: res })
    })
    .catch(err =>
    {
        console.log("err from postLogin:", err)
        dispatch({ type: LOGIN_USER_FAIL, payload: err })
    })
}

export const getUserRooms = userId => dispatch =>
{
    dispatch({ type: GET_USER_ROOMS_START })

    axiosWithAuth().get(`${baseURL}/api/map/${userId}`)
    .then(res =>
    {
        console.log("res from getUserRooms:", res)
        dispatch({ type: GET_USER_ROOMS_SUCCESS, payload: res })
    })
    .catch(err =>
    {
        console.log("err from getUserRooms:", err)
        dispatch({ type: GET_USER_ROOMS_FAIL, payload: err })
    })
}

export const postUserRoom = (userId, room) => dispatch =>
{
    dispatch({ type: POST_THING_START })

    axiosWithAuth().post(`${baseURL}/api/map/${userId}`, room)
    .then(res =>
    {
        console.log("res from postUserRoom:", res)
        dispatch({ type: POST_THING_SUCCESS, payload: res })
    })
    .catch(err =>
    {
        console.log("err from postUserRoom:", err)
        dispatch({ type: POST_THING_FAIL, payload: err })
    })
}