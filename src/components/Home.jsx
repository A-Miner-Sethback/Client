import React from "react"
import { Link } from 'react-router-dom'
import {useSelector, useDispatch} from "react-redux"
import {postMove, getInit} from "../store/actions"
import { HomePageDiv, MapContainer, RoomDescription, Controls, RoomDiv, CurRoomDiv, ExitDiv } from './Styles'

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
                {/* <div className='room room1'>1</div>
                <div className='room'>2</div>
                <div className='room'>3</div>
                <div className='room'>4</div>
                <div className='room'>5</div>
                <div className='room'>6</div> */}
                {state.rooms.map(room =>
                {
                    if(room)
                    {
                        if(room.id === state.curRoom.room_id)
                        {
                            return (
                                <CurRoomDiv key={room.id} xCoord={Number(room.x) + 1} yCoord={Number(room.y) + 1}>
                                    {room.id}
                                    {/* {room.n_to !== -2 && <ExitDiv y={'8x'} x={'4.5px'} />}
                                    {room.e_to !== -2 && <ExitDiv y={'-12px'} x={'12px'} />}
                                    {room.s_to !== -2 && <ExitDiv y={'-24px'} x={'4.5px'} />}
                                    {room.w_to !== -2 && <ExitDiv y={'-12px'} x={'-4.5px'} />} */}
                                </CurRoomDiv>
                            )
                        }
                        return (
                            <RoomDiv key={room.id} xCoord={Number(room.x) + 1} yCoord={Number(room.y) + 1}>
                                {room.id}
                                {/* {room.n_to !== -2 && <ExitDiv y={'8x'} x={'4.5px'} />}
                                {room.e_to !== -2 && <ExitDiv y={'-12px'} x={'12px'} />}
                                {room.s_to !== -2 && <ExitDiv y={'-24px'} x={'4.5px'} />}
                                {room.w_to !== -2 && <ExitDiv y={'-12px'} x={'-4.5px'} />} */}
                            </RoomDiv>
                        )
                    }
                    else return
                })}
            </MapContainer>
            <div className="room-controls">
                <RoomDescription>
                    {state && state.curRoom && <>
                        <p>Title: {state.curRoom.title}</p>
                        <p>ID: {state.curRoom.room_id}</p>
                        <p>Description: {state.curRoom.description}</p>
                        <p>Coords: {state.curRoom.coordinates}</p>
                        <p>Elevation: {state.curRoom.elevation}</p>
                        <p>Terrain: {state.curRoom.terrain}</p>
                        <p>Exits: {state.curRoom.exits}</p>
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
                    <Link to="/login"><button>Login</button></Link>
                </Controls>
            </div>
        </HomePageDiv>
    )
}

export default Home