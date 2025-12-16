/**
 * Server-Side Application Configuration
 * 
 * Extends the base application configuration with server-specific providers
 * for Angular Universal (Server-Side Rendering / SSR).
 * 
 * This configuration is used during server-side rendering to:
 * 1. Enable SSR platform support
 * 2. Register server-side routes
 * 3. Handle platform-specific operations on the server
 * 
 * The base configuration (appConfig) is merged with server-specific providers.
 * 
 * @see https://angular.io/guide/universal
 */

import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

/**
 * Server-specific configuration
 * 
 * Provides:
 * - Server rendering platform support
 * - Server-side routes configuration
 */
const serverConfig: ApplicationConfig = {
  providers: [
    /* Enable Angular Universal with server routes */
    provideServerRendering(withRoutes(serverRoutes))
  ]
};

/**
 * Merged configuration combining:
 * 1. Base application config (browser + common services)
 * 2. Server config (SSR-specific providers)
 * 
 * This is used in main.server.ts for server-side rendering
 */
export const config = mergeApplicationConfig(appConfig, serverConfig);
