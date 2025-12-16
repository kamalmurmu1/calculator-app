/**
 * CalculatorComponent - Advanced Angular Calculator
 * 
 * This standalone Angular component implements a fully-featured calculator with:
 * - Support for basic arithmetic operations (+, -, *, /)
 * - BODMAS/PEMDAS operator precedence (multiplication & division before addition & subtraction)
 * - Multi-digit number input with decimal support
 * - Expression display showing the full calculation (e.g., "6 + 5 * 2")
 * - Error handling for division by zero
 * - Undo/backspace functionality
 * 
 * The calculator uses the Shunting-yard algorithm to convert infix expressions
 * to Reverse Polish Notation (RPN) for accurate precedence-aware evaluation.
 * 
 * @example
 * Input: "6 + 5 * 2" → Evaluates to 16 (not 22)
 * Input: "10 / 2 + 3" → Evaluates to 8
 */
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
  /** Primary display value shown to user */
  display: string = '0';
  
  /** Legacy: stores previous operand (kept for compatibility) */
  previousValue: number = 0;
  
  /** Current number being typed by user (e.g., "123") */
  currentValue: string = '';
  
  /** Current operator selected (+, -, *, /) or null if none */
  operation: string | null = null;
  
  /** Flag to reset display on next number input (e.g., after operator or equals) */
  shouldResetDisplay: boolean = false;
  
  /** Array of tokens forming infix expression: ['6', '+', '10', '*', '2'] */
  tokens: string[] = [];

  /**
   * Getter that returns the expression to display
   * - Shows only the operator immediately after operator selection (e.g., '+')
   * - Shows current number while typing
   * - Falls back to main display
   */
  get shownDisplay(): string {
    if (this.operation && this.shouldResetDisplay) {
      return this.operation;
    }
    if (this.currentValue !== '') {
      return this.currentValue;
    }
    return this.display;
  }

  /**
   * Append a digit to the current number
   * @param num - Digit to append (0-9)
   * 
   * @example
   * User presses 5 → currentValue becomes "5"
   * User presses 3 → currentValue becomes "53"
   */
  appendNumber(num: string): void {
    if (this.shouldResetDisplay) {
      this.currentValue = num;
      this.shouldResetDisplay = false;
    } else {
      this.currentValue = this.currentValue === '' ? num : this.currentValue + num;
    }
    this.display = this.currentValue;
  }

  /**
   * Append a decimal point to current number
   * Prevents multiple decimals in same number
   * 
   * @example
   * currentValue = '5' → becomes '5.'
   * Pressing again does nothing (prevents '5..')
   */
  appendDecimal(): void {
    if (this.shouldResetDisplay) {
      this.currentValue = '0.';
      this.shouldResetDisplay = false;
    } else if (!this.currentValue.includes('.')) {
      this.currentValue = this.currentValue === '' ? '0.' : this.currentValue + '.';
    }
    this.display = this.currentValue;
  }

  /**
   * Handle operator selection (+, -, *, /)
   * Allows operator chaining for expressions like "6 + 5 * 2"
   * 
   * Algorithm:
   * 1. If no current value and last token is operator, replace it (allows changing operator)
   * 2. Push current number and operator to tokens array
   * 3. Set flag to reset display on next number
   * 4. Clear currentValue for next number input
   */
  setOperation(op: string): void {
    // Allow operator change: if no number entered yet but last token is operator
    if (this.currentValue === '' && this.tokens.length > 0) {
      const last = this.tokens[this.tokens.length - 1];
      if (['+', '-', '*', '/'].includes(last)) {
        this.tokens[this.tokens.length - 1] = op;
        this.operation = op;
        this.shouldResetDisplay = true;
        return;
      }
    }

    if (this.currentValue === '') return;

    // Build the expression token by token
    this.tokens.push(this.currentValue);
    this.tokens.push(op);
    this.operation = op;
    this.shouldResetDisplay = true;
    this.currentValue = '';
  }

  /**
   * Calculate the result of the expression
   * 
   * Steps:
   * 1. Finalize expression by adding last number to tokens
   * 2. Convert infix notation to RPN (Reverse Polish Notation)
   * 3. Evaluate RPN using stack-based algorithm
   * 4. Handle errors (division by zero, invalid expressions)
   * 5. Display result and reset state
   */
  calculate(): void {
    if (this.currentValue !== '') {
      this.tokens.push(this.currentValue);
    }
    if (this.tokens.length === 0) return;

    try {
      const rpn = this.infixToRPN(this.tokens);
      const result = this.evaluateRPN(rpn);
      this.display = result.toString();
      this.currentValue = result.toString();
      this.tokens = [];
      this.operation = null;
      this.shouldResetDisplay = true;
    } catch (err) {
      this.display = 'Error';
      this.currentValue = '';
      this.tokens = [];
      this.operation = null;
      this.shouldResetDisplay = true;
    }
  }

  /**
   * Clear all calculator state (AC button)
   * Resets to initial state as if calculator was just turned on
   */
  clear(): void {
    this.display = '0';
    this.currentValue = '';
    this.previousValue = 0;
    this.operation = null;
    this.shouldResetDisplay = false;
    this.tokens = [];
  }

  /**
   * Backspace/Delete functionality
   * - If typing a number: remove last digit
   * - If expression is built: remove last token (operator or number)
   */
  backspace(): void {
    if (this.currentValue !== '') {
      this.currentValue = this.currentValue.slice(0, -1);
      this.display = this.currentValue === '' ? '0' : this.currentValue;
      return;
    }

    if (this.tokens.length > 0) {
      this.tokens.pop();
      const last = this.tokens[this.tokens.length - 1];
      if (last && ['+', '-', '*', '/'].includes(last)) {
        this.operation = last;
      } else {
        this.operation = null;
      }
    }
  }

  /**
   * Shunting-Yard Algorithm: Convert Infix to Reverse Polish Notation (RPN)
   * 
   * This algorithm respects operator precedence:
   * - * and / have precedence 2
   * - + and - have precedence 1
   * 
   * Example:
   * Input (infix):  ['6', '+', '5', '*', '2']
   * Output (RPN):   ['6', '5', '2', '*', '+']
   * Evaluation: (5 * 2 = 10), then (6 + 10 = 16)
   * 
   * @param tokens - Array of numbers and operators in infix notation
   * @returns Array of tokens in RPN notation ready for evaluation
   * 
   * @see https://en.wikipedia.org/wiki/Shunting-yard_algorithm
   */
  private infixToRPN(tokens: string[]): string[] {
    const output: string[] = [];
    const ops: string[] = [];
    const prec: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2 };

    for (const token of tokens) {
      if (!isNaN(Number(token))) {
        // Numbers go directly to output
        output.push(token);
      } else if (['+', '-', '*', '/'].includes(token)) {
        // Operators: pop higher-precedence operators to output first
        while (
          ops.length > 0 &&
          ['+', '-', '*', '/'].includes(ops[ops.length - 1]) &&
          prec[ops[ops.length - 1]] >= prec[token]
        ) {
          output.push(ops.pop() as string);
        }
        ops.push(token);
      }
    }

    // Pop remaining operators to output
    while (ops.length > 0) {
      output.push(ops.pop() as string);
    }

    return output;
  }

  /**
   * Evaluate RPN (Reverse Polish Notation) Expression
   * 
   * Uses a stack-based algorithm:
   * - Numbers: push to stack
   * - Operators: pop two operands, apply operation, push result back
   * 
   * Example evaluation of ['6', '5', '2', '*', '+']:
   * 1. Push 6 → stack: [6]
   * 2. Push 5 → stack: [6, 5]
   * 3. Push 2 → stack: [6, 5, 2]
   * 4. '*': pop 2, 5 → 5*2=10 → push 10 → stack: [6, 10]
   * 5. '+': pop 10, 6 → 6+10=16 → push 16 → stack: [16]
   * 6. Result: 16
   * 
   * @param rpn - Array of tokens in RPN notation
   * @returns Final calculated result
   * @throws Error if invalid expression or division by zero
   */
  private evaluateRPN(rpn: string[]): number {
    const stack: number[] = [];
    for (const token of rpn) {
      if (!isNaN(Number(token))) {
        stack.push(Number(token));
      } else {
        const b = stack.pop();
        const a = stack.pop();
        if (a === undefined || b === undefined) throw new Error('Invalid expression');
        let res = 0;
        switch (token) {
          case '+':
            res = a + b;
            break;
          case '-':
            res = a - b;
            break;
          case '*':
            res = a * b;
            break;
          case '/':
            if (b === 0) throw new Error('Division by zero');
            res = a / b;
            break;
        }
        // Round to avoid floating-point precision errors
        // (e.g., 0.1 + 0.2 = 0.30000000000000004)
        res = Math.round(res * 1e12) / 1e12;
        stack.push(res);
      }
    }
    if (stack.length !== 1) throw new Error('Invalid expression');
    return stack[0];
  }

  /**
   * Getter that returns the full expression to display
   * Combines tokens array and current input
   * 
   * @example
   * After "6 + 5": returns "6 + 5"
   * After "6 + 5 * 2": returns "6 + 5 * 2"
   * While typing "6 + ": returns "6 +"
   */
  get fullExpression(): string {
    const left = this.tokens.join(' ');
    if (this.currentValue !== '') {
      return (left ? left + ' ' : '') + this.currentValue;
    }
    return left || this.display;
  }
}

