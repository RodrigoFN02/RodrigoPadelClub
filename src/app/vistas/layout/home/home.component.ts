import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
images = [
    'assets/home/foto-carousel1.jpg',
    'assets/home/foto-carousel2.jpg',
    'assets/home/foto-carousel3.jpg',
  ];
}
