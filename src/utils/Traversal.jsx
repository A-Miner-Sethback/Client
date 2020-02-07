import React, {useState} from "react"
import {useSelector, useDispatch} from "react-redux"
import {postMove, travCurRoomSet, travCurRoomSetAfterDash, travSuccess} from "../store/actions"
import { axiosWithAuth, axaBE } from './axiosWithAuth'

const Traversal = _ =>
{

    // const baseURL = `https://backendtreasure.herokuapp.com`
    const baseURL = `http://localhost:5000`

    const lambdaURL = `https://lambda-treasure-hunt.herokuapp.com/api`

    const dispatch = useDispatch()
    const state = useSelector(state => state)


    const [stopTraversal, setStopTraversal] = useState(false)
    
    const [bftTarget, setBftTarget] = useState('')

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

    function sleep(ms) 
    {
        console.log('sleep ran', ms)
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function dft(cd=state.curRoom.cd)
    {
        let s = []
        let cur = state.rooms.filter(el => el.id === state.curRoom.room_id)
        console.log('cur', cur)

        
        let curRoom = state.curRoom
        let prevRoom = curRoom
        
        // let noUnwalkedAtCur = false
        // if(getUnwalkedNeighbors(cur).length > 0)
        // {
            s.push(getUnwalkedNeighbors(cur)[0])
        // }
        // else noUnwalkedAtCur = true

        while(s.length > 0 && state.rooms.length < 500 && !stopTraversal)
        {
            let roomsRes
            // if(!noUnwalkedAtCur)
            // {
            let d = s.pop()

            await sleep(cd * 1000)
            console.log('after dft sleep')
            let res = await axiosWithAuth().post(`${lambdaURL}/adv/move`, {direction: d})

            prevRoom = curRoom
            curRoom = res.data
            cd = res.data.cooldown
            
            dispatch(travCurRoomSet(curRoom, prevRoom))
            roomsRes = await axaBE().post(`${baseURL}/api/map/${state.userId}/travel`, {curRoom, prevRoom, direction: d})
            console.log('dft roomsRes', roomsRes)
            dispatch(travSuccess(roomsRes))
            let r_next = roomsRes.data.filter(el => el.id === curRoom.room_id)
            let nextUnwalked = getUnwalkedNeighbors(r_next, roomsRes.data)
            if(nextUnwalked.length > 0)
            {
                s.push(nextUnwalked[0])
                console.log('s after pushing nextUnwalked', s)
            }
            // else noUnwalkedAtCur = true
            // }
            else if(roomsRes.data.length < 500) //&& noUnwalkedAtCur)
            {
                let pathToUnwalked = bft(curRoom, roomsRes.data)
                let bftRoomsRes
                console.log('pathToUnwalked', pathToUnwalked)
                while(pathToUnwalked.length > 1 && state.rooms.length < 500 && !stopTraversal)
                {
                    let dBft = pathToUnwalked.shift()
                    console.log('dbft[0]', dBft[0])
                    console.log('dbft[1]', dBft[1])
                    await sleep(cd * 1000)
                    let bftRes = await axiosWithAuth().post(`${lambdaURL}/adv/move`, {direction: dBft[0], next_room_id: `${dBft[1].id}`})
                    
                    prevRoom = curRoom
                    curRoom = bftRes.data
                    cd = curRoom.cooldown
                    console.log('prevRoom after bft move', prevRoom)
                    console.log('curRoom after bft move', curRoom)
                    dispatch(travCurRoomSet(curRoom, prevRoom))
                    bftRoomsRes = await axaBE().post(`${baseURL}/api/map/${state.userId}/travel`, {curRoom, prevRoom, direction: dBft[0]})
                    console.log('bftRoomsRes', bftRoomsRes)
                    dispatch(travSuccess(bftRoomsRes))
                }
                if(bftRoomsRes.data.length < 500)
                {
                    console.log('pathToUnwalked[0][0]', pathToUnwalked[0][0])
                    s.push(pathToUnwalked[0][0])
                }
            }
        }
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
        // console.log('room from getAnyNeighbors', room)
        // console.log('rooms from getAnyNeighbors', rooms)
        let stateRoom = rooms.filter(el => 
        {
            // console.log('el', el)
            return el.id === room.id
        })[0]
        // console.log('stateRoom', stateRoom)
        
        let nextRooms = []
        let possibleDirs = ['n_to', 'e_to', 's_to', 'w_to']
        possibleDirs.forEach(el =>
        {
            if(stateRoom[el] !== -2)
            {
                // console.log('el', el)
                let nextRoom = rooms.filter(elem => elem.id === stateRoom[el])
                // console.log('nextRoom', nextRoom)
                if(nextRoom.length > 0) nextRooms.push(nextRoom[0])
            }
        })
        // console.log('nextRooms', nextRooms)
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
            // console.log('q', q)
            let path = q.shift()
            let r = path[path.length-1]
            // console.log('r', r)
            // console.log('path', path)
            // console.log('vis', visitedSet)
            if(r && !visitedSet.has(r.id))
            {
                // console.log('bbbb')
                visitedSet.add(r.id)
                
                if(getUnwalkedNeighbors([r], tempRooms).length > 0)
                {
                    let dirPath = []
                    for(let i=1; i<path.length; i++)
                    {
                        dirPath.push([getDir(path[i-1], path[i], tempRooms), path[i]])
                    }
                    dirPath.push([getUnwalkedNeighbors([r], tempRooms)[0], r])
                    
                    console.log('dirPath', dirPath)
                    // console.log('aaaaa')
                    return dirPath
                }
                let nextRooms = getAnyNeighbors(r, tempRooms)
                // console.log('nextRooms before for loop', nextRooms)
                for(let i=0; i<nextRooms.length; i++)
                {
                    if(!visitedSet.has(nextRooms[i]))
                    {
                        let newPath = [...path]
                        newPath.push(nextRooms[i])
                        // console.log('newPath', newPath)
                        q.push(newPath)
                    }
                        
                }
                
            }
        }
    }

    function handleTraverse()
    {
        setStopTraversal(false)
        dft()
    }

    function handleStopTraversal() { setStopTraversal(true)}


    function bftToTar(curRoom, tempRooms, target)
    {
        let q = []
        let cur = tempRooms.filter(el => el.id === curRoom.room_id)[0]
        q.push([cur])
        let visitedSet = new Set()
        while(q.length > 0)
        {
            let path = q.shift()
            let r = path[path.length-1]
            if(r && !visitedSet.has(r.id))
            {
                visitedSet.add(r.id)
                console.log('r.id, target', r.id, target)
                if(r.id === Number(target))
                {
                    let dirPath = []
                    for(let i=1; i<path.length; i++)
                    {
                        dirPath.push([getDir(path[i-1], path[i], tempRooms), path[i]])
                    }
                    console.log('dirPath', dirPath)
                    return dirPath
                }
                let nextRooms = getAnyNeighbors(r, tempRooms)
                for(let i=0; i<nextRooms.length; i++)
                {
                    if(!visitedSet.has(nextRooms[i]))
                    {
                        let newPath = [...path]
                        newPath.push(nextRooms[i])
                        q.push(newPath)
                    }
                }
            }
        }
    }

    function dashFind(path)
    {
        let retPath = []
        console.log('path', path)
        if(path.length < 3)
        {
            path.forEach(el =>
            {
                let a = el
                a.unshift('t')
                retPath.push(a)
            })
            return retPath
        }

        for(let i=0; i<path.length; i++)
        {
            let j = i
            let next_room_ids = []
            while(j < path.length && path[j][0] === path[i][0])
            {
                console.log('j', j)
                next_room_ids.push(path[j][1].id)
                j++
            }
            if(j >= 3 + i)
            {
                console.log('b')
                let a = [path[i][0]]
                a.unshift('d')
                a.push(next_room_ids)
                retPath.push(a)
                i = j-1
            }
            else
            {
                let a = path[i]
                console.log(a)
                a.unshift('t')
                retPath.push(a)
            }
        }
        console.log('retPath', retPath)
        return retPath


    }

    async function bftToRoom(roomId)
    {
        let pathToUnwalked = bftToTar(state.curRoom, state.rooms, roomId)
        pathToUnwalked = dashFind(pathToUnwalked)
        console.log('a', pathToUnwalked)
        let curRoom = state.curRoom
        let prevRoom = curRoom
        let cd = state.curRoom.cooldown
        console.log('pathToUnwalked', pathToUnwalked)
        while(pathToUnwalked.length > 0)
        {
            let dBft = pathToUnwalked.shift()
            // console.log('dbft[0]', dBft[0])
            // console.log('dbft[1]', dBft[1])
            await sleep(cd * 1000)
            let bftRes
            if(dBft[0] === 't')
            {
                bftRes = await axiosWithAuth().post(`${lambdaURL}/adv/move`, {direction: dBft[1], next_room_id: `${dBft[2].id}`})
            }
            else
            {
                let dashObj =
                {
                    'direction': dBft[1], 
                    'num_rooms': `${dBft[2].length}`,
                    'next_room_ids': dBft[2].join(',')
                }
                bftRes = await axiosWithAuth().post(`${lambdaURL}/adv/dash`, dashObj)
            }
            
            prevRoom = curRoom
            curRoom = bftRes.data
            cd = curRoom.cooldown
            console.log('prevRoom after bft move', prevRoom)
            console.log('curRoom after bft move', curRoom)
            dispatch(travCurRoomSetAfterDash(curRoom, prevRoom))
            // bftRoomsRes = await axaBE().post(`${baseURL}/api/map/${state.userId}/travel`, {curRoom, prevRoom, direction: dBft[0]})
            // console.log('bftRoomsRes', bftRoomsRes)
            // dispatch(travSuccess(state.rooms))
        }
    }

    const handleChange = e => setBftTarget(e.target.value)

    const handleBftToRoom = e => bftToRoom(bftTarget)

    return (
        <>
            <button onClick={handleTraverse}>Traverse</button>
            <button onClick={handleStopTraversal}>Stop Traversal</button>
            <button onClick={handleBftToRoom}>BFT to Room</button>
            <input type="text" value={bftTarget} onChange={handleChange}/>
        </>
    )
}

export default Traversal