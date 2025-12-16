/**
 * App Component Test Suite
 * 
 * Unit tests for the root application component
 * 
 * Tests cover:
 * - Component instantiation and initialization
 * - Template rendering and DOM structure
 * - Signal reactivity (title binding)
 * 
 * Uses Angular's TestBed for component testing with Angular standalone components.
 * 
 * @see https://angular.io/guide/testing
 */

import { TestBed } from '@angular/core/testing';
import { App } from './app';

/**
 * App Component Unit Tests
 * 
 * TestBed configures a testing module that imports the standalone App component.
 * Each test creates a ComponentFixture which provides access to the component
 * instance and native DOM element for assertions.
 */
describe('App', () => {
  /**
   * Setup hook that runs before each test
   * 
   * Configures TestBed to compile the App component and resolve its dependencies.
   * Since App is standalone, we import it directly into the TestBed configuration.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  /**
   * Test: Component instantiation
   * 
   * Verifies that the App component can be created and instantiated successfully.
   * This is a basic smoke test to ensure the component is properly configured.
   */
  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  /**
   * Test: Title rendering
   * 
   * Verifies that the h1 element renders the title signal value.
   * - Creates component fixture
   * - Waits for stability (all async operations complete)
   * - Queries the DOM for h1 element
   * - Asserts that title text is rendered and contains expected content
   * 
   * Note: The expected text "Hello, calculator-app" should match the title
   * signal value or the expression in app.html
   */
  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, calculator-app');
  });
});
