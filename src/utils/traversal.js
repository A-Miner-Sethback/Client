import { move } from '../store/actions'

class Graph
{
    constructor()
    {
        this.rooms = []
    }
    moveDir(dir, next=null)
    {
        move(dir, next)
        
    }
}


class Player
{
    constructor()
    {

    }
}