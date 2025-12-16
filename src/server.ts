/**
 * Express Server for Server-Side Rendering (SSR)
 * 
 * This file sets up an Express.js server that:
 * 1. Handles server-side rendering via Angular Universal
 * 2. Serves static assets (JavaScript, CSS, images)
 * 3. Provides routing to the Angular application
 * 4. Can host REST API endpoints
 * 
 * Architecture:
 * - AngularNodeAppEngine: Handles SSR rendering on server
 * - Express middleware: Serves static files and routes requests
 * - Platform-agnostic: Works with Express, Firebase, or other Node servers
 * 
 * Environment:
 * - PORT: Server port (default 4000)
 * - Browser assets in: /browser directory
 * - Angular SSR bundle used for rendering
 * 
 * @see https://angular.io/guide/universal
 */

import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

/**
 * Path to pre-built browser bundle
 * Contains compiled Angular components and assets
 */
const browserDistFolder = join(import.meta.dirname, '../browser');

/**
 * Create Express application instance
 */
const app = express();

/**
 * Create Angular Universal rendering engine
 * Handles server-side rendering of Angular components
 */
const angularApp = new AngularNodeAppEngine();

/**
 * REST API Endpoints (Optional)
 * 
 * Example Express endpoints can be defined here to serve data to the client
 * Uncomment and define as needed:
 * 
 * Example API route:
 * ```ts
 * app.get('/api/calculate', (req, res) => {
 *   res.json({ result: 42 });
 * });
 * ```
 * 
 * All API endpoints should return before the catch-all Angular route
 */

/**
 * Serve Static Files Middleware
 * 
 * Configuration:
 * - maxAge: '1y' - Cache assets for 1 year (safe for versioned filenames)
 * - index: false - Don't auto-serve index.html for directories
 * - redirect: false - Don't auto-redirect /foo to /foo/
 * 
 * Serves compiled JavaScript, CSS, images from /browser folder
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Server-Side Rendering Handler
 * 
 * Catches all remaining routes and renders Angular app on server
 * 
 * Process:
 * 1. Express receives request
 * 2. angularApp.handle() processes request and renders Angular
 * 3. Rendered HTML response is written back to client
 * 4. Client receives pre-rendered HTML + JavaScript for hydration
 * 5. Angular hydrates on client for interactive experience
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the Server
 * 
 * Only runs if:
 * - This module is the main entry point (npm start)
 * - Running under PM2 process manager (production deployment)
 * 
 * Port Configuration:
 * - Environment variable PORT if set
 * - Defaults to 4000
 * 
 * Output: Logs server URL to console
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Export Request Handler
 * 
 * Used by:
 * - Angular CLI dev-server during development
 * - Angular CLI build process for SSR bundle
 * - Firebase Cloud Functions for serverless deployment
 * 
 * Wraps the Express app for use in different hosting platforms
 */
export const reqHandler = createNodeRequestHandler(app);
