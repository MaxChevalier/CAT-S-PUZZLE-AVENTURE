import { Cell } from "../interfaces/cell";

export class Spot{
    x : number;
    y : number;
    f : number;
    g : number;
    h : number;
    previous : Spot|null;
    neighbors : Array<Spot>;
    cell: Cell;
    isLocked: boolean = false;


    constructor(x: number, y: number, cell: Cell, isLocked: boolean = false){
        this.x = x;
        this.y = y;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.previous = null;
        this.neighbors = [];
        this.cell = cell;
        this.isLocked = isLocked;
    }

    public addNeighbors(spots: Array<Array<Spot>>){
        if (this.x < spots.length - 1){
            this.neighbors.push(spots[this.x + 1][this.y]);
        }
        if (this.x > 0){
            this.neighbors.push(spots[this.x - 1][this.y]);
        }
        if (this.y < spots[0].length - 1){
            this.neighbors.push(spots[this.x][this.y + 1]);
        }
        if (this.y > 0){
            this.neighbors.push(spots[this.x][this.y - 1]);
        }
    }

    public equals(spot: Spot): boolean{
        return this.x == spot.x && this.y == spot.y;
    }

    public isThrough(turn: number): boolean{
        return this.cell.through[turn % this.cell.through.length];
    }

}