import React from "react"
import {useSelector, useDispatch} from "react-redux"
import {postMove} from "../store/actions"

const Traversal = _ =>
{

    const dispatch = useDispatch()
    const state = useSelector(state => state)

    function doNothing(){}
    function timeoutCD()
    {
        setTimeout(doNothing, state.curRoom.cooldown*1000 + 50)
    }

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

    function getUnwalkedNeighbors(room)
    {
        let stateRoom = state.rooms.filter(el => el.id === room.room_id)
        let unwalked = []
        ['n', 'e', 's', 'w'].forEach(el =>
        {
            if(stateRoom[`${el}_to`] === -1)
            {
                unwalked.push(el)
            }
        })

        return shuffleArray(unwalked)
    }

    function dft()
    {
        let s = []
        s.push(getUnwalkedNeighbors(state.curRoom)[0])

        while(s.length > 0)
        {
            timeoutCD()
            d = s.pop()

            dispatch(postMove(d))
            r_next = state.curRoom
            nextUnwalked = getUnwalkedNeighbors(curRoom)
            if(nextUnwalked.length > 0)
            {
                s.push(nextUnwalked[0])
                // for(let i=0; i<nextUnwalked.length; i++)
                // {
                //     s.push(nextUnwalked[i])
                // }
            }
            else if(state.rooms.length < 500)
            {
                bft()
            }
        }
    }
    

    function bft()
    {
        let q = []
        q.push([state.curRoom])
        let visitedSet = new Set()
        while(q.length > 0)
        {
            let path = q.shift()
            let r = path[path.length-1]
            if(r && !visitedSet.has(r.id))
            {
                visitedSet.add(r.id)
                // state.rooms.exits[0] === -1
            }
        }
    }



    return (
        <>

        </>
    )
}

export default Traversal