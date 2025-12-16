import { Component } from '@angular/core';
import { CalculatorComponent } from './calculator';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CalculatorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
