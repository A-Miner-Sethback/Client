import styled from 'styled-components'

export const HomePageDiv = styled.div`
    display: flex;
    margin: auto;
    margin-top: 50px;
    height: 1200px;
    width: 90%;

    .room-controls {
        display: flex;
        flex-direction: column;
        width: 25%
    }
`;

export const MapContainer = styled.div`
    width: 75%;
    display: grid;
    background-color: gray;
    overflow: scroll;
    grid-template-columns: repeat(80, 1fr);
    grid-template-rows: repeat(80, 1fr);
`;

export const RoomDescription = styled.div`
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    background-color: black;
    width: 100%;
    height: 50%;
    color: white;
    p {
        padding: 10px;
    }
`;

export const Controls = styled.div`
    background-color: maroon;
    width: 100%;
    height: 50%;

    .directions {
        margin-top: 15px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .top {
            display: flex;
            justify-content: center;
            width: 100%;
            .button {
                width: 20%;
            }
        }

        .middle {
            display: flex;
            justify-content: space-evenly;
            width: 100%;
            .button {
                width: 20%
            }
        }

        .bottom {
            display: flex;
            justify-content: center;
            width: 100%;
            .button {
                width: 20%;
            }
        }
    }
`;

export const RoomDiv = styled.div`
    grid-column-start: ${props => props.xCoord};
    grid-row-start: ${props => 80 - props.yCoord};
    height: 16px;
    width: 16px;
    font-size: 8px;
    border: 1px solid;
    border-top-color: ${props => props.borderTop};
    border-right-color: ${props => props.borderRight};
    border-bottom-color: ${props => props.borderBottom};
    border-left-color: ${props => props.borderLeft};
    background-color: yellow;
    /* .cur-room{
        border-color: red;
    } */
`;

export const CurRoomDiv = styled.div`
    grid-column-start: ${props => props.xCoord};
    grid-row-start: ${props => 80 - props.yCoord};
    height: 16px;
    width: 16px;
    font-size: 10px;
    border: 2px solid;
    border-top-color: ${props => props.borderTop};
    border-right-color: ${props => props.borderRight};
    border-bottom-color: ${props => props.borderBottom};
    border-left-color: ${props => props.borderLeft};
    background-color: red;
`;

export const ExitDiv = styled.div`
    position: relative;
    top: ${props => props.y};
    left: ${props => props.x};
    border-radius: 100%;
    width: 3px;
    height: 3px;
    background-color: blue;
`;