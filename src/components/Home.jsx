import React from "react"
import {useSelector, useDispatch} from "react-redux"
import {postMove, getInit} from "../store/actions"
import { HomePageDiv, MapContainer, RoomDescription, Controls } from './Styles'

const Home = _ =>
{
    const dispatch = useDispatch()
    const state = useSelector(state => state)

    class Graph
    {
        constructor()
        {
            this.rooms = []
        }
        moveDir(dir, next=null)
        {
            dispatch(postMove(dir, next))
        }
    }


    const handleInit = e =>
    {
        dispatch(getInit())
    }

    const handleMove = dir =>
    {
        dispatch(postMove(dir))
    }

    return (
        <HomePageDiv>
            <MapContainer>
                a
            </MapContainer>
            <div className="room-controls">
                <RoomDescription>
                    <p>b</p>
                </RoomDescription>
                <Controls>
                    <button className="init" onClick={handleInit}>Init</button>
                    <div className='directions'>
                        <div className='top'>
                            <button className='direction' onClick={() => handleMove('n')}>N</button>
                        </div>
                        <div className='middle'>
                            <button className='direction' onClick={() => handleMove('s')}>E</button>
                            <button className='direction' onClick={() => handleMove('e')}>W</button>
                        </div>
                        <div className='bottom'>
                            <button className='direction' onClick={() => handleMove('w')}>S</button>
                        </div>
                    </div>
                </Controls>
            </div>
        </HomePageDiv>
    )
}

export default Home