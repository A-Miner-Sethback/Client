import styled from 'styled-components'

export const HomePageDiv = styled.div`
    display: flex;
    margin: auto;
    margin-top: 50px;
    height: 1000px;
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
    background-color: green;
    grid-template-columns: repeat(100, 1fr);
    grid-template-rows: repeat(100, 1fr);
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
    background-color: red;
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