import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calculator.html',
  styleUrls: ['./calculator.css'],
})
export class CalculatorComponent {
  display: string = '0';
  previousValue: number = 0;
  currentValue: string = '';
  operation: string | null = null;
  shouldResetDisplay: boolean = false;

  appendNumber(num: string): void {
    if (this.shouldResetDisplay) {
      this.display = num;
      this.shouldResetDisplay = false;
    } else {
      this.display = this.display === '0' ? num : this.display + num;
    }
    this.currentValue = this.display;
  }

  appendDecimal(): void {
    if (this.shouldResetDisplay) {
      this.display = '0.';
      this.shouldResetDisplay = false;
    } else if (!this.display.includes('.')) {
      this.display += '.';
    }
    this.currentValue = this.display;
  }

  setOperation(op: string): void {
    if (this.currentValue === '') return;
    
    if (this.previousValue !== 0 && this.operation) {
      this.calculate();
    }
    
    this.previousValue = parseFloat(this.currentValue);
    this.operation = op;
    this.shouldResetDisplay = true;
  }

  calculate(): void {
    if (!this.operation || this.currentValue === '') return;

    const current = parseFloat(this.currentValue);
    let result: number = 0;

    switch (this.operation) {
      case '+':
        result = this.previousValue + current;
        break;
      case '-':
        result = this.previousValue - current;
        break;
      case '*':
        result = this.previousValue * current;
        break;
      case '/':
        result = this.previousValue / current;
        break;
    }

    this.display = result.toString();
    this.currentValue = result.toString();
    this.previousValue = 0;
    this.operation = null;
    this.shouldResetDisplay = true;
  }

  clear(): void {
    this.display = '0';
    this.currentValue = '';
    this.previousValue = 0;
    this.operation = null;
    this.shouldResetDisplay = false;
  }

  backspace(): void {
    if (this.display.length > 1) {
      this.display = this.display.slice(0, -1);
    } else {
      this.display = '0';
    }
    this.currentValue = this.display;
  }
}
