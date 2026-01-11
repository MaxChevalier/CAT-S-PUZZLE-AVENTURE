import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CellComponent } from '../cell/cell.component';
import { Cell } from '../../../../../interfaces/cell';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-cell-selector',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    CellComponent,
  ],
  templateUrl: './cell-selector.component.html',
  styleUrl: './cell-selector.component.css'
})
export class CellSelectorComponent {
  @Input({ required: true }) cellsType: Array<{ cell: Cell, nb: number }> = [];
  @Input({ required: true }) cellSize: string = '10px';

  @Output() cellDragId: EventEmitter<{ X: number, Y: number } | { I: number }> = new EventEmitter();
  @Output() cellDrop: EventEmitter<null> = new EventEmitter();
	nativeElement: any;

  cellDragIdChild(event: { X: number, Y: number } | { I: number }) {
    this.cellDragId.emit(event);
  }

  dragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }
  drop(event: any) {
    this.cellDrop.emit(null);
  }
}
