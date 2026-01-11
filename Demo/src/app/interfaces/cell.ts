export interface Cell {
    id: number;
    name: string;
    description: string;
    image: Array<string>;
    type: string;
    through: Array<boolean>;
    speed: number;
}