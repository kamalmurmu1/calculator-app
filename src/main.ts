/**
 * Application Bootstrap Entry Point
 * 
 * This file is the main entry point for the Angular application. It:
 * - Imports the standalone root component (App)
 * - Imports application-level configuration
 * - Bootstraps the application into the DOM
 * - Handles any bootstrap errors
 * 
 * Modern Angular (v14+) uses `bootstrapApplication()` instead of NgModuleRef
 * for standalone applications without NgModule configuration.
 * 
 * Configuration includes:
 * - Providers (services, interceptors)
 * - Preloading strategies
 * - Error handlers
 * - Platform features
 * 
 * @see https://angular.io/api/platform-browser/bootstrapApplication
 */

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

/**
 * Bootstrap the Angular application
 * 
 * - Passes the root component (App) to bootstrap
 * - Passes configuration object with providers and settings
 * - Error is caught and logged to console if bootstrap fails
 * 
 * Once bootstrapped, the App component is rendered into the HTML element
 * with selector matching the root component (typically <app-root></app-root>)
 */
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
