/**
 * Application Configuration
 * 
 * Provides application-level services and configuration for the Angular app.
 * This replaces the traditional NgModule approach in modern Angular standalone apps.
 * 
 * Configuration includes:
 * 1. Global Error Handlers - Catches unhandled errors globally
 * 2. Client Hydration - Supports server-side rendering with event replay
 * 
 * Providers are injected into all components and services in the application.
 * 
 * @see https://angular.io/api/core/ApplicationConfig
 */

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

/**
 * Application Configuration Object
 * 
 * Provides:
 * - Global error listeners: Captures uncaught errors across the application
 * - Client hydration: Enables SSR (Server-Side Rendering) with event replay
 *   This allows events to be captured during initial load and replayed
 *   when the application fully hydrates on the client.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    /* Global error handling for unhandled exceptions */
    provideBrowserGlobalErrorListeners(),
    /* Client hydration with event replay for SSR support */
    provideClientHydration(withEventReplay()),
  ]
};
