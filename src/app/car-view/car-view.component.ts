import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-car-view',
  standalone: true,
  imports: [],
  templateUrl: './car-view.component.html',
  styleUrl: './car-view.component.scss'
})
export class CarViewComponent {
  @Input() carImageUrl: string | null = null;
}
