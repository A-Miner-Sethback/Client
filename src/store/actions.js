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
export const GET_INIT_START = "GET_INIT_START"
export const GET_INIT_SUCCESS = "GET_INIT_SUCCESS"
export const GET_INIT_FAIL = "GET_INIT_FAIL"
export const INIT_ROOM_EXISTS = "INIT_ROOM_EXISTS"
export const SET_CURRENT_ROOM = "SET_CURRENT_ROOM"


const baseURL = `https://backendtreasure.herokuapp.com`
// const baseURL = `http://localhost:5000`

const lambdaURL = `https://lambda-treasure-hunt.herokuapp.com/api`

export const postRegistration = (user, history) => dispatch =>
{
    dispatch({ type: REGISTER_USER_START })

    axios.post(`${baseURL}/api/auth/register`, user)
    .then(res =>
    {
        console.log("res from postRegistration:", res)
        localStorage.setItem('token', res.data.token)
        dispatch({ type: REGISTER_USER_SUCCESS, payload: res })
        history.push('/')
    })
    .catch(err =>
    {
        console.log("err from postRegistration:", err)
        dispatch({ type: REGISTER_USER_FAIL, payload: err })
    })
}

export const postLogin = (user, history) => dispatch =>
{
    dispatch({ type: LOGIN_USER_START })

    axios.post(`${baseURL}/api/auth/login`, user)
    .then(res =>
    {
        console.log("res from postLogin:", res)
        localStorage.setItem('token', res.data.token)
        dispatch({ type: LOGIN_USER_SUCCESS, payload: res })
        history.push('/')
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

    axaBE().get(`${baseURL}/api/map/${userId}`)
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
    dispatch({ type: ADD_USER_ROOM_START })

    axaBE().post(`${baseURL}/api/map/${userId}`, room)
    .then(res =>
    {
        console.log("res from postUserRoom:", res)
        dispatch({ type: ADD_USER_ROOM_SUCCESS, payload: room })
    })
    .catch(err =>
    {
        console.log("err from postUserRoom:", err)
        dispatch({ type: ADD_USER_ROOM_FAIL, payload: err })
    })
}

export const postMove = (direction, userId, curRoom, prevRoom, next=null) => dispatch =>
{
    dispatch({ type: TRAVEL_DIRECTION_START })
    if(next !== null)
    {
        axiosWithAuth().post(`${lambdaURL}/adv/move`, {'direction': direction, 'next_room_id': next})
        .then(res =>
        {
            prevRoom = curRoom
            curRoom = res.data
            console.log("res from postMove:", res)
            dispatch({type: SET_CURRENT_ROOM, payload: {curRoom, prevRoom}})
            axaBE().post(`${baseURL}/api/map/${userId}/travel`, {curRoom, prevRoom, direction})
            .then(resp =>
            {
                console.log('resp in postmove', resp)
                dispatch({ type: TRAVEL_DIRECTION_SUCCESS, payload: resp })
            })
        })
        .catch(err =>
        {
            console.log("err from postMove:", err)
            dispatch({ type: TRAVEL_DIRECTION_FAIL, payload: err })
        })
    }
    else
    {
        axiosWithAuth().post(`${lambdaURL}/adv/move`, {direction})
        .then(res =>
        {
            prevRoom = curRoom
            curRoom = res.data
            console.log("res from postMove:", res)
            dispatch({type: SET_CURRENT_ROOM, payload: {curRoom, prevRoom}})
            axaBE().post(`${baseURL}/api/map/${userId}/travel`, {curRoom, prevRoom, direction})
            .then(resp =>
            {
                console.log('resp in postmove', resp)
                dispatch({ type: TRAVEL_DIRECTION_SUCCESS, payload: resp })
            })
        })
        .catch(err =>
        {
            console.log("err from postMove:", err)
            dispatch({ type: TRAVEL_DIRECTION_FAIL, payload: err })
        })
    }
}

export const getInit = userId => dispatch =>
{
    dispatch({ type: GET_INIT_START })

    axiosWithAuth().get(`${lambdaURL}/adv/init`)
    .then(res =>
    {
        console.log("res from getInit:", res)
        let room = res.data

        dispatch({type: SET_CURRENT_ROOM, payload: {curRoom: room, prevRoom:room}})
        axaBE().get(`${baseURL}/api/map/${userId}`)
        .then(response =>
        {
            console.log('a', response)
            let roomIds = response.data.map(el => el.id)
            if(roomIds.includes(room.id))
            {
                console.log('room already in db')
                dispatch({type: INIT_ROOM_EXISTS, payload: response})
            }
            else
            {   
                axaBE().post(`${baseURL}/api/map/${userId}`, room)
                .then(resp3 =>
                {
                    console.log('resp3', resp3)
                    dispatch({ type: GET_INIT_SUCCESS, payload: resp3 })
                })
                .catch(err =>
                {
                    console.log("err from getInit:", err)
                    dispatch({ type: GET_INIT_FAIL, payload: err })
                })
            }
        })
        .catch(err =>
        {
            console.log("err from getInit:", err)
            dispatch({ type: GET_INIT_FAIL, payload: err })
        })
    })
    .catch(err =>
    {
        console.log("err from getInit:", err)
        dispatch({ type: GET_INIT_FAIL, payload: err })
    })
}