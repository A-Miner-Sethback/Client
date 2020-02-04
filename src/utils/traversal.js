import { postMove } from '../store/actions'

export class Graph
{
    constructor()
    {
        this.rooms = []
    }
    moveDir(dir, next=null, cb)
    {
        cb(dir, next)
    }
}


export class Player
{
    constructor()
    {

    }
}