/**
 * Root Component of the Calculator Application
 * 
 * This is the main/bootstrap component that wraps the entire calculator app.
 * It provides:
 * - Layout and styling for the app container
 * - Title signal for the application name
 * - Imports the CalculatorComponent for display
 * 
 * @standalone - Uses Angular's new standalone component API (no NgModule required)
 * @component
 */
import { Component, signal } from '@angular/core';
import { CalculatorComponent } from './calculator';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CalculatorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Signal for reactive app title - updates display without manual change detection
  title = signal('calculator-app');
}
