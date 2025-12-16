/**
 * Server-Side Routes Configuration
 * 
 * Defines how the server should render different routes in the application
 * for Angular Universal (Server-Side Rendering / SSR).
 * 
 * Each ServerRoute specifies:
 * - path: The URL pattern to match
 * - renderMode: How to render this route (Prerender, AppShell, or Server)
 * 
 * @see https://angular.io/guide/universal#universal-template-engine
 */

import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Server Routes Array
 * 
 * Defines rendering strategy for all routes:
 * - path: '**' catches all routes
 * - renderMode: RenderMode.Prerender means these routes are pre-rendered
 *   at build time and served as static HTML files
 * 
 * Benefits of Prerender:
 * - Routes are pre-rendered at build time to static HTML
 * - Faster initial page loads
 * - Better SEO (search engines get full HTML)
 * - Reduces server load
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
