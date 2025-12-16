/**
 * Server-Side Bootstrap Entry Point
 * 
 * This file is used for server-side rendering (SSR) with Angular Universal.
 * It's invoked on the server during build or request time to render the
 * application to HTML string that's sent to the client.
 * 
 * Unlike main.ts (browser bootstrap):
 * - This receives a BootstrapContext instead of rendering to DOM
 * - Uses server-specific configuration (app.config.server)
 * - Returns a bootstrap function for the server renderer to invoke
 * 
 * Process:
 * 1. Angular Universal calls this bootstrap function
 * 2. Passes a BootstrapContext with server-specific info
 * 3. Component tree is rendered to HTML string
 * 4. HTML is sent to browser for hydration
 * 
 * @see https://angular.io/guide/universal
 */

import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

/**
 * Server Bootstrap Function
 * 
 * Called by Angular Universal to render the app on the server
 * 
 * @param context - BootstrapContext containing server request/response info
 * @returns Promise that resolves when component tree is rendered to HTML
 * 
 * Process:
 * 1. Bootstraps the App component with server config
 * 2. Renders component tree to HTML string
 * 3. Resolves when rendering completes
 */
const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(App, config, context);

/* Export bootstrap function for Angular Universal to use */
export default bootstrap;
