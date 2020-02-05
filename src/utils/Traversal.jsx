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

        let dftInterval = setInterval(() => {

            
            console.log('s', s)
            let d = s.pop()
            
            axiosWithAuth().post(`${lambdaURL}/adv/move`, {direction: d})
            .then(res =>
            {
                let prevRoom = state.curRoom
                let curRoom = res.data
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
                        // for(let i=0; i<nextUnwalked.length; i++)
                        // {
                        //     s.push(nextUnwalked[i])
                        // }
                    }
                    else if(state.rooms.length < 500)
                    {
                        // let pathToUnwalked = await bft()
                        // while(pathToUnwalked.length > 0)
                        // {
                        //     timeoutCD()
                        //     let dBft = pathToUnwalked.shift()
                        //     dispatch(postMove(dBft))
                        // }
                    }
                })
                .then(_ =>
                {
                    console.log('s.length right before clearInterval', s.length)
                    if(s.length === 0) clearInterval(dftInterval)
                })
            })
        }, Number(state.curRoom.cooldown)*1000 + 50)
    }
    
    function getDir(room_1, room_2)
    {
        let roomsObj = {}
        for(let i=0; i<state.rooms.length; i++)
        {
            roomsObj[state.rooms[i].id] = {
                n_to: state.rooms[i].n_to,
                e_to: state.rooms[i].e_to,
                s_to: state.rooms[i].s_to,
                w_to: state.rooms[i].w_to,
            }
        }
        if(roomsObj[room_1.room_id].n_to === room_2.room_id) return 'n'
        if(roomsObj[room_1.room_id].e_to === room_2.room_id) return 'e'
        if(roomsObj[room_1.room_id].s_to === room_2.room_id) return 's'
        if(roomsObj[room_1.room_id].w_to === room_2.room_id) return 'w'

    }

    function getAnyNeighbors(room)
    {
        let stateRoom = state.rooms.filter(el => el.id === room.id)
        let nextRooms = []
        let possibleDirs = ['n', 'e', 's', 'w']
        possibleDirs.forEach(el =>
        {
            if(stateRoom[`${el}_to`] !== -2)
            {
                let nextRoom = state.rooms.filter(el => el.id === stateRoom[`${el}_to`])
                nextRooms.push(nextRoom)
            }
        })
        console.log('nextRooms', nextRooms)
        return shuffleArray(nextRooms)
    }

    async function bft()
    {
        let q = []
        let cur = state.rooms.filter(el => el.id === state.curRoom.room_id)
        q.push([cur])
        let visitedSet = new Set()
        while(q.length > 0)
        {
            console.log('q', q)
            let path = q.shift()
            let r = path[path.length-1]
            console.log('r', 'path', r, path)
            console.log('vis', visitedSet)
            if(r && !visitedSet.has(r.id))
            {
                console.log('bbbb')
                visitedSet.add(r.id)
                if(getUnwalkedNeighbors(r).length > 0)
                {
                    let dirPath = []
                    for(let i=1; i<path.length; i++)
                    {
                        dirPath.push(getDir(path[i-1], path[i]))
                        dirPath.push(getUnwalkedNeighbors(r)[0])
                    }
                    console.log('dirPath', dirPath)
                    console.log('aaaaa')
                    return dirPath
                }
                let nextDirs = getAnyNeighbors(r)
                for(let i=0; i<nextDirs.length; i++)
                {
                    let newPath = [...path].push(nextDirs[i])
                    console.log('newPath', newPath)
                    q.push(newPath)
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