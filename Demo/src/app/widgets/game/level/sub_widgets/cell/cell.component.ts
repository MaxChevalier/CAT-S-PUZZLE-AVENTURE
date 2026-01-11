import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [NgIf],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css'
})
export class CellComponent {
  @Input({ required: true }) image: string = '';
  @Input({ required: true }) name: string = 'no data';
  @Input({ required: true }) cellSize: string = '10px';
  @Input({ required: true }) id: { X: number, Y: number } | { I: number } = { I: 0 };
  @Input({ required: true }) isLocked: boolean = false;

  @Output() cellDragId: EventEmitter<{ X: number, Y: number } | { I: number }> = new EventEmitter();

  dragStart(event: any) {
    this.cellDragId.emit(this.id);
  }

  dragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }
}
