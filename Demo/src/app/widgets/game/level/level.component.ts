import { Component, ViewChild } from '@angular/core';
import { MapComponent } from './sub_widgets/map/map.component';
import { HeroComponent } from './sub_widgets/hero/hero.component';
import { Spot } from '../../../scripts/spot';
import { CellSelectorComponent } from './sub_widgets/cell-selector/cell-selector.component';
import { Cell } from '../../../interfaces/cell';
import { NgIf, CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { SubscriberController } from '../../../scripts/subscriberController';

@Component({
	selector: 'app-level',
	standalone: true,
	imports: [
		NgIf,
		MapComponent,
		HeroComponent,
		CellSelectorComponent,
		CommonModule,
	],
	templateUrl: './level.component.html',
	styleUrl: './level.component.css'
})
export class LevelComponent extends SubscriberController {

	heroSpeed: number = 250;
	turns: number = 0;
	cellsType: Array<{ cell: Cell, nb: number }> = [
		{ nb: 1, cell: { image: ["assets/sprites/cat_pack/start.png"], name: "start", through: [true], speed: 1 } as Cell },
		{ nb: 1, cell: { image: ["assets/sprites/cat_pack/end.png"], name: "end", through: [true], speed: 1 } as Cell },
		{ nb: -1, cell: { image: ["assets/sprites/cat_pack/wall.png"], name: "wall", through: [false], speed: 0 } as Cell },
		{ nb: -1, cell: { image: ["assets/sprites/cat_pack/slow1.png"], name: "water", through: [true], speed: 2 } as Cell },
		{ nb: -1, cell: { image: ["assets/sprites/cat_pack/slow2.png"], name: "squid", through: [true], speed: 3 } as Cell },
		{ nb: -1, cell: { image: ["assets/sprites/cat_pack/wall_switch_on.png", "assets/sprites/cat_pack/wall_switch_off.png"], name: "spike_on", through: [false, true], "speed": 1 } as Cell },
		{ nb: -1, cell: { image: ["assets/sprites/cat_pack/wall_switch_off.png", "assets/sprites/cat_pack/wall_switch_on.png"], name: "spike_off", through: [true, false], "speed": 1 } as Cell },
	];
	cellDrag: { cell: Cell, id: { X: number, Y: number } | { I: number } } | null = null;
	defaultCell: Cell = { image: ["assets/sprites/cat_pack/floor.png"], name: "floor", through: [true], speed: 1 } as Cell;
	start: Spot | null = null;
	timeouts: { [key: number]: any } = {};
	mapSize: { x: number, y: number } = { x: 15, y: 15 };
	cellSize: string = 'calc(min(calc(95vh - 28px), calc(85vw - 28px)) / 15)'
	defaultLayout: Array<{ x: number, y: number, cell: Cell }> = [];
	id: any = 0;

	@ViewChild(HeroComponent) heroComponent: HeroComponent | undefined;
	@ViewChild(MapComponent) mapComponent: MapComponent | undefined;
	@ViewChild(CellSelectorComponent) cellSelectorComponent: CellSelectorComponent | undefined;

	constructor(private readonly titleService: Title) {
		super();
		this.titleService.setTitle("Demo - CAT’S PUZZLE AVENTURE");
	}

	ngOnInit() {
		let cellSelectorComponentWidth = this.cellSelectorComponent ? this.cellSelectorComponent.nativeElement.offsetWidth : 0;
		this.cellSize = `
		calc(
			min(
				calc(95vh - 28px), 
				calc(95vw - 10rem - 28px - ${cellSelectorComponentWidth}px)
			) / max(
				max(
					${this.mapSize.x},
					${this.mapSize.y}
				), 15
			)
		)
		`
	}

	async getPath(path: Array<Spot> | null | undefined) {
		if (path == null || path == undefined) {
			console.log('No path found');
		}
		else {
			this.turns = 0;
			let index = 0;
			this.setStart(path[0]);
			path.shift();
			path.forEach(spot => {
				this.setTimeout(() => {
					this.heroComponent?.moveTo(spot.y, spot.x, spot.cell.speed);
				}, this.heroSpeed * index);
				for (let i = 0; i < spot.cell.speed; i++) {
					this.setTimeout(() => {
						this.turns++;
					}, this.heroSpeed * (index + 0.5));
					index++;
				}
			});
			this.setTimeout(() => {
				this.heroComponent?.updateAnimation('eat');
			}, this.heroSpeed * index);
		}
	}

	setTimeout(callback: () => void, time: number) {
		let id = 0;
		do {
			id++;
		} while (this.timeouts[id] != null);
		this.timeouts[id] = setTimeout(() => {
			callback();
			delete this.timeouts[id];
		}, time);
	}

	setStart(start: Spot) {
		this.start = start;
		this.heroComponent?.moveTo(start.y, start.x, 0);
		this.heroComponent?.updateAnimation('sleep');
	}

	setCellDrag(event: { cell: Cell, id: { X: number, Y: number } | { I: number }, clear: boolean } | { X: number, Y: number } | { I: number }) {
		this.stopResolving();
		if ('clear' in event && event.clear) {
			if (this.cellDrag != null && 'I' in this.cellDrag.id) {
				this.cellsType[this.cellDrag.id.I].nb--;
				this.cellsType.forEach((cellType, index) => {
					if (cellType.cell.name == event.cell.name) {
						this.cellsType[index].nb++;

						if (cellType.cell.name == 'start' && this.mapComponent) {
							this.mapComponent.start = null;
						}
					}
				});
			}
			this.cellDrag = null;
		}
		else if ('cell' in event) {
			this.cellDrag = event;
		}
		else if ('I' in event) {
			this.cellDrag = { 'cell': this.cellsType[event.I].cell, 'id': event };
		}
	}

	stockTiles(event: null) {
		if (this.cellDrag != null && 'X' in this.cellDrag.id) {
			this.cellsType.forEach((cellType, index) => {
				if (cellType.cell.name == this.cellDrag!.cell.name) {
					this.cellsType[index].nb++;
					if (this.cellDrag!.cell.name == 'start' && this.mapComponent) {
						this.mapComponent.start = null;
					}
				}
			});
			this.mapComponent?.changeCell(this.cellDrag.id.X, this.cellDrag.id.Y, this.defaultCell);
		}
		this.cellDrag = null;
	}

	stopResolving() {
		if (this.heroComponent) {
			this.heroComponent.updateAnimation('wait');
		}
		Object.keys(this.timeouts).forEach(key => {
			clearTimeout(this.timeouts[parseInt(key)]);
			delete this.timeouts[parseInt(key)];
		});
		this.turns = 0;
		if (this.start) {
			this.setStart(this.start);
		}
	}

	solve() {
		this.stopResolving();
		this.getPath(this.mapComponent?.findPath());
	}

}
