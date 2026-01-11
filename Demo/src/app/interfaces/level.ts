import { Cell } from "./cell";

export interface Level {
    id: number;
    name: string;
    creator: string;
    creation_date: Date;
    modification_date: Date;
    size_x: number,
    size_y: number,
    obstacles: Array<{ nb: number, cell: Cell }>;
    defaultObstacleId: Cell;
    defaultLayout: Array<{ x: number, y: number, cell: Cell }>;
}