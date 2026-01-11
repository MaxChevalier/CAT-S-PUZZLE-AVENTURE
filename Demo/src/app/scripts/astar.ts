import { Spot } from "./spot";

export class Astar{
    spots: Array<Array<Spot>>;
    openSet: Array<Spot>;
    closedSet: Array<Spot>;
    path: Array<Spot>;
    path_length: number;
    start: Spot;
    end: Spot;

    constructor(spots: Array<Array<Spot>>, start: Spot, end: Spot){
        this.spots = spots;
        this.start = start;
        this.end = end;
        this.openSet = [];
        this.closedSet = [];
        this.path = [];
        this.path_length = 0;
    }

    public findPath(): Array<Spot>|null{

        this.openSet.push(this.start);

        while (this.openSet.length > 0){
            let winner = 0;
            for (let i = 0; i < this.openSet.length; i++){
                if (this.openSet[i].f < this.openSet[winner].f){
                    winner = i;
                }
            }
            let current: Spot = this.openSet[winner];

            this.path = [];
            let temp = current;
            this.path.push(temp);
            this.path_length = temp.cell.speed;
            while (temp.previous){
                this.path.push(temp.previous);
                this.path_length += temp.previous.cell.speed;
                temp = temp.previous;
            }

            if (current.equals(this.end)){
                return this.path;
            }

            this.openSet = this.openSet.filter(spot => !spot.equals(current));
            this.closedSet.push(current);

            if (current.neighbors.length == 0){
                current.addNeighbors(this.spots);
            }

            let neighbors = current.neighbors;
            neighbors.forEach(neighbor => {
                if (!this.closedSet.includes(neighbor) && neighbor.isThrough(this.path_length)){
                    let tempG = neighbor.cell.speed + current.g;
                    let newPath = false;

                    if (this.openSet.includes(neighbor)){
                        if (tempG < neighbor.g){
                            newPath = true;
                        }
                    } else {
                        newPath = true;
                        this.openSet.push(neighbor);
                    }

                    if (newPath){
                        neighbor.h = this.heuristic(neighbor, this.end);
                        neighbor.g = tempG;
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.previous = current;
                    }
                }
            });
        }
        return null;
    }

    private heuristic(a: Spot, b: Spot): number{
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

}

