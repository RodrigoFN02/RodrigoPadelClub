import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() titulo!: string;
  @Input() descripcion!: string;
  @Input() imagen!: string;
  @Input() eventoId!: number;

  @Output() apuntarseEvent = new EventEmitter<number>();
  apuntarse() {
    this.apuntarseEvent.emit(this.eventoId);
  }
}
