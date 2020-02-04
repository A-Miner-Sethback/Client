import 
{
    REGISTER_USER_START,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOGIN_USER_START,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    GET_USER_ROOMS_START,
    GET_USER_ROOMS_SUCCESS,
    GET_USER_ROOMS_FAIL,
    ADD_USER_ROOM_START,
    ADD_USER_ROOM_SUCCESS,
    ADD_USER_ROOM_FAIL,
    TRAVEL_DIRECTION_START,
    TRAVEL_DIRECTION_SUCCESS,
    TRAVEL_DIRECTION_FAIL,
    PRAY_START,
    PRAY_SUCCESS,
    PRAY_FAIL,
    GET_INIT_START,
    GET_INIT_SUCCESS,
    GET_INIT_FAIL,
    INIT_ROOM_EXISTS,
} from './actions'


const initialState =
{
    userId: "",
    isLoading: false,
    rooms: [],
    prevRoom: {},
    curRoom: {},
}

export const reducer = (state = initialState, action) =>
{
    switch(action.type)
    {
        case REGISTER_USER_START:
            return {
                ...state,
                isLoading: true,
                error: "",
            }
        case REGISTER_USER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                userId: action.payload.data.userId,
                error: "",
            }
        case REGISTER_USER_FAIL:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            }
        case LOGIN_USER_START:
            return {
                ...state,
                isLoading: true,
                error: "",
            }
        case LOGIN_USER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                userId: action.payload.data.userId,
                error: "",
            }
        case LOGIN_USER_FAIL:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            }
        case GET_USER_ROOMS_START:
            return {
                ...state,
                isLoading: true,
                error: "",
            }
        case GET_USER_ROOMS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                rooms: action.payload.data.rooms, //TODO: check this
                error: "",
            }
        case GET_USER_ROOMS_FAIL:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            }
        case ADD_USER_ROOM_START:
            return {
                ...state,
                isLoading: true,
                error: "",
            }
        case ADD_USER_ROOM_SUCCESS:
            return {
                ...state,
                isLoading: false,
                rooms: [...state.rooms, action.payload],
                error: "",
            }
        case ADD_USER_ROOM_FAIL:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            }
        case TRAVEL_DIRECTION_START:
            return {
                ...state,
                isLoading: true,
                error: "",
            }
        case TRAVEL_DIRECTION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                rooms: action.payload.data,
                error: "",
            }
        case TRAVEL_DIRECTION_FAIL:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            }
        case PRAY_START:
            return {
                ...state,
                isLoading: true,
                error: "",
            }
        case PRAY_SUCCESS:
            return {
                ...state,
                isLoading: false,
                
                error: "",
            }
        case PRAY_FAIL:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            }
        case GET_INIT_START:
            return {
                ...state,
                isLoading: true,
                error: "",
            }
        case GET_INIT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                curRoom: action.payload.data,
                rooms: [...state.rooms, action.payload.data],
                error: "",
            }
        case GET_INIT_FAIL:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            }
        case INIT_ROOM_EXISTS:
            return {
                ...state,
                isLoading: false,
                curRoom: action.payload.data,
                rooms: [...state.rooms, action.payload.data],
                error: "",
            }
        default:
            return state
    }
}