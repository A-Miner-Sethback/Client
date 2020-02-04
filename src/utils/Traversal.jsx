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
        setTimeout(doNothing, state.cooldown*1000 + 50)
    }

    function getUnwalkedNeighbors(room)
    {

    }

    function dft()
    {
        let s = []
        s.push(getUnwalkedNeighbors(state.curRoom)[0])

        while(s.length > 0)
        {
            timeoutCD()
            r = s.pop()

            if(!state.rooms.includes(r[1].id))
            {
                dispatch(postMove(r[0]))
                r_next = state.curRoom
                nextUnwalked = getUnwalkedNeighbors(curRoom)
                if(nextUnwalked.length > 0)
                {
                    for(let i=0; i<nextUnwalked.length; i++)
                    {
                        s.push(nextUnwalked[i])
                    }
                }
                else if(state.rooms.length < 500)
                {
                    bft()
                }
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