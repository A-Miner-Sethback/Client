import React, {useEffect, useState} from "react"
import { Link } from 'react-router-dom'
import {useSelector, useDispatch} from "react-redux"
import {postMove, getInit, decrementCD, pickup, sell, confirmSell, status} from "../store/actions"
import { HomePageDiv, MapContainer, RoomDescription, Controls, RoomDiv, CurRoomDiv, ExitDiv } from './Styles'
import Traversal from '../utils/Traversal'

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

    const [entry, setEntry] = useState('')

    const handleEntry = e =>
    {
        setEntry(e.target.value)
    }

    const handleInit = e =>
    {
        dispatch(getInit(state.userId))
    }

    const handleMove = dir =>
    {
        if(state.rooms.length > 0)
        {
            let stateRoom = state.rooms.filter(el =>
            {
                if(el && el.id === state.curRoom.room_id) return true
                return false
            })[0]
            let dirObj = {'n': 'n_to', 'e': 'e_to', 's': 's_to', 'w': 'w_to'}
            if(stateRoom && stateRoom[dirObj[dir]] > -1)
            {
                dispatch(postMove(dir, state.userId, state.curRoom, state.prevRoom, `${stateRoom[dirObj[dir]]}`))
            }
            else
            {
                dispatch(postMove(dir, state.userId, state.curRoom, state.prevRoom))
            }
        }
        else
        {
            dispatch(postMove(dir, state.userId, state.curRoom, state.prevRoom))
        }
    }

    const handlePickup = _ => dispatch(pickup(entry))

    const handleSell = _ => dispatch(sell(entry))
    const handleConfirmSell = _ => dispatch(confirmSell(entry))

    const handleStatus = _ => dispatch(status())
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
                {state.rooms && state.rooms.map(room =>
                {
                    if(room)
                    {
                        if(room.id === state.curRoom.room_id)
                        {
                            return (
                                <CurRoomDiv key={room.id} xCoord={Number(room.x) + 1} yCoord={Number(room.y) + 1}>
                                    {room.id}
                                </CurRoomDiv>
                            )
                        }
                        return (
                            <RoomDiv 
                                key={room.id} 
                                xCoord={Number(room.x) + 1} 
                                yCoord={Number(room.y) + 1}
                                borderTop={room.n_to !== -2 ? 'cyan' : 'black'}
                                borderRight={room.e_to !== -2 ? 'cyan' : 'black'}
                                borderBottom={room.s_to !== -2 ? 'cyan' : 'black'}
                                borderLeft={room.w_to !== -2 ? 'cyan' : 'black'}
                            >
                                {room.id}

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
                        <p>Items: {state.curRoom.items}</p>
                        <p>Cooldown: {state.cooldown}</p>
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
                    <input type="text" name="entry" value={entry} onChange={handleEntry}/>
                    <button onClick={handlePickup}>Pickup</button>
                    <button onClick={handleSell}>Sell</button>
                    <button onClick={handleConfirmSell}>Confirm Sell</button>
                    <button onClick={handleStatus}>Status</button>
                    {/* <Traversal /> */}
                </Controls>
            </div>
        </HomePageDiv>
    )
}

export default Home