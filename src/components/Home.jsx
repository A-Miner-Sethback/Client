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
        dispatch(getInit(state.userId))
    }

    const handleMove = dir =>
    {
        dispatch(postMove(dir, state.userId, state.curRoom, state.prevRoom))
    }
    console.log(state)
    return (
        <HomePageDiv>
            <MapContainer>
                <div className='room room1'>1</div>
                <div className='room'>2</div>
                <div className='room'>3</div>
                <div className='room'>4</div>
                <div className='room'>5</div>
                <div className='room'>6</div>
            </MapContainer>
            <div className="room-controls">
                <RoomDescription>
                    {state && state.curRoom && <>
                        <p>Title: {state.curRoom.title}</p>
                        <p>Description: {state.curRoom.description}</p>
                        <p>Coords: {state.curRoom.coordinates}</p>
                        <p>Elevation: {state.curRoom.elevation}</p>
                        <p>Terrain: {state.curRoom.terrain}</p>
                        {/* <p>players: {state.curRoom.players}</p> */}
                        {/* <p>Items: {state.curRoom.items}</p> */}
                        {/* <p>Exits: {state.curRoom.exits.forEach(exit => <p>{exit}</p>)} */}
                        <p>Cooldown: {state.curRoom.cooldown}</p>
                    </>}
                </RoomDescription>
                <Controls>
                    <button className="init button is-info is-fullwidth" onClick={handleInit}>Init</button>
                    <div className='directions'>
                        <div className='top'>
                            <button className='direction button is-info' onClick={() => handleMove('n')}>N</button>
                        </div>
                        <div className='middle'>
                            <button className='direction button is-info' onClick={() => handleMove('w')}>W</button>
                            <button className='direction button is-info' onClick={() => handleMove('e')}>E</button>
                        </div>
                        <div className='bottom'>
                            <button className='direction button is-info' onClick={() => handleMove('s')}>S</button>
                        </div>
                    </div>
                </Controls>
            </div>
        </HomePageDiv>
    )
}

export default Home