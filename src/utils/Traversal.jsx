import React from "react"
import {useSelector, useDispatch} from "react-redux"
import {postMove, travCurRoomSet, travSuccess} from "../store/actions"
import { axiosWithAuth, axaBE } from './axiosWithAuth'

const Traversal = _ =>
{

    // const baseURL = `https://backendtreasure.herokuapp.com`
    const baseURL = `http://localhost:5000`

    const lambdaURL = `https://lambda-treasure-hunt.herokuapp.com/api`

    const dispatch = useDispatch()
    const state = useSelector(state => state)

    function doNothing(){}
    // function timeoutCD(cb)
    // {
    //     setTimeout(cb, Number(state.curRoom.cooldown)*1000 + 50)
    // }

    function shuffleArray(arr)
    {
        let arrCopy = [...arr]
        let retArr = []
        while(arrCopy.length > 0)
        {
            let a = arrCopy.splice(Math.floor(Math.random()*arrCopy.length), 1)
            retArr.push(a[0])
        }

        return retArr
    }

    function getUnwalkedNeighbors(room, rooms=state.rooms)
    {
        console.log('room in getUnwalked', room)
        let stateRoom = rooms.filter(el => el.id === room[0].id)
        let unwalked = []
        let dirs = [['n_to', 'n'], ['e_to','e'], ['s_to','s'], ['w_to', 'w']]
        dirs.forEach(el =>
        {
            if(stateRoom[0][el[0]] === -1)
            {
                unwalked.push(el[1])
            }
        })
        console.log('unwalked', unwalked)
        return shuffleArray(unwalked)
    }

    function dft()
    {
        let s = []
        let cur = state.rooms.filter(el => el.id === state.curRoom.room_id)
        console.log('cur', cur)
        s.push(getUnwalkedNeighbors(cur)[0])
        let curRoom = state.curRoom
        let dftInterval = setInterval(() => {

            console.log('s', s)
            let d = s.pop()
            
            axiosWithAuth().post(`${lambdaURL}/adv/move`, {direction: d})
            .then(res =>
            {
                let prevRoom = state.curRoom
                curRoom = res.data
                let tempRooms
                dispatch(travCurRoomSet(curRoom, prevRoom))
                axaBE().post(`${baseURL}/api/map/${state.userId}/travel`, {curRoom, prevRoom, direction: d})
                .then(resp =>
                {
                    tempRooms = resp.data
                    console.log('tempRooms', tempRooms)
                    dispatch(travSuccess(resp))
                    let r_next = tempRooms.filter(el => el.id === curRoom.room_id)
                    console.log('r_next', r_next)
                    let nextUnwalked = getUnwalkedNeighbors(r_next, tempRooms)
                    if(nextUnwalked.length > 0)
                    {
                        s.push(nextUnwalked[0])
                        console.log('s after pushing nextUnwalked', s)
                    }
                    else if(state.rooms.length < 500)
                    {
                        let pathToUnwalked = bft(curRoom, tempRooms)
                        console.log('pathToUnwalked', pathToUnwalked)
                        let bftInterval = setInterval(_ =>
                        {
                            let dBft = pathToUnwalked.shift()
                            // dispatch(postMove(dBft))
                            axiosWithAuth().post(`${lambdaURL}/adv/move`, {direction: dBft})
                            .then(res =>
                            {
                                prevRoom = state.curRoom
                                curRoom = res.data
                                dispatch(travCurRoomSet(curRoom, prevRoom))
                                axaBE().post(`${baseURL}/api/map/${state.userId}/travel`, {curRoom, prevRoom, direction: dBft})
                                .then(resp =>
                                {
                                    dispatch(travSuccess(resp))
                                })
                            })
                            if(state.rooms >= 500)
                            {
                                clearInterval(bftInterval)
                            } 
                            else if(pathToUnwalked.length === 0) 
                            {
                                s.push(curRoom)
                                clearInterval(bftInterval)
                            }
                        }, Number(curRoom.cooldown)*1000 + 500)

                    }
                })
                .then(_ =>
                {
                    console.log('s.length right before clearInterval', s.length)
                    if(s.length === 0) clearInterval(dftInterval)
                })
            })
        }, Number(curRoom.cooldown)*1000 + 50)
    }
    
    function getDir(room_1, room_2, rooms=state.rooms)
    {
        console.log('room 1 from getDir', room_1)
        console.log('room 2 from getDir', room_2)
        console.log('rooms from getDir', rooms)
        let roomsObj = {}
        for(let i=0; i<rooms.length; i++)
        {
            roomsObj[rooms[i].id] = {
                n_to: rooms[i].n_to,
                e_to: rooms[i].e_to,
                s_to: rooms[i].s_to,
                w_to: rooms[i].w_to,
            }
        }
        if(roomsObj[room_1.id].n_to === room_2.id) return 'n'
        if(roomsObj[room_1.id].e_to === room_2.id) return 'e'
        if(roomsObj[room_1.id].s_to === room_2.id) return 's'
        if(roomsObj[room_1.id].w_to === room_2.id) return 'w'

    }

    function getAnyNeighbors(room, rooms=state.rooms)
    {
        console.log('room from getAnyNeighbors', room)
        console.log('rooms from getAnyNeighbors', rooms)
        let stateRoom = rooms.filter(el => 
        {
            console.log('el', el)
            return el.id === room.id
        })[0]
        console.log('stateRoom', stateRoom)
        
        let nextRooms = []
        let possibleDirs = ['n_to', 'e_to', 's_to', 'w_to']
        possibleDirs.forEach(el =>
        {
            if(stateRoom[el] !== -2)
            {
                console.log('el', el)
                let nextRoom = rooms.filter(elem => elem.id === stateRoom[el])
                console.log('nextRoom', nextRoom)
                if(nextRoom.length > 0) nextRooms.push(nextRoom[0])
            }
        })
        console.log('nextRooms', nextRooms)
        return shuffleArray(nextRooms)
    }

    function bft(curRoom, tempRooms)
    {
        let q = []
        let cur = tempRooms.filter(el => el.id === curRoom.room_id)[0]
        q.push([cur])
        let visitedSet = new Set()
        while(q.length > 0)
        {
            console.log('q', q)
            let path = q.shift()
            let r = path[path.length-1]
            console.log('r', r)
            console.log('path', path)
            console.log('vis', visitedSet)
            if(r && !visitedSet.has(r.id))
            {
                console.log('bbbb')
                visitedSet.add(r.id)
                if(getUnwalkedNeighbors([r], tempRooms).length > 0)
                {
                    let dirPath = []
                    for(let i=1; i<path.length; i++)
                    {
                        dirPath.push(getDir(path[i-1], path[i], tempRooms))
                        dirPath.push(getUnwalkedNeighbors([r], tempRooms)[0])
                    }
                    console.log('dirPath', dirPath)
                    console.log('aaaaa')
                    return dirPath
                }
                let nextRooms = getAnyNeighbors(r, tempRooms)
                console.log('nextRooms before for loop', nextRooms)
                for(let i=0; i<nextRooms.length; i++)
                {
                    if(!visitedSet.has(nextRooms[i]))
                    {
                        let newPath = [...path]
                        newPath.push(nextRooms[i])
                        console.log('newPath', newPath)
                        q.push(newPath)
                    }
                        
                }
                
            }
        }
    }

    function handleTraverse()
    {
        dft()
    }

    return (
        <>
            <button onClick={handleTraverse}>Traverse</button>
        </>
    )
}

export default Traversal