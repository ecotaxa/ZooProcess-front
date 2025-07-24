/**
 * Application constants
 */
// @ts-ignore
const env = import.meta.env;
// console.log(import.meta.env.VITE_API_SERVER);

// API server URL
export const API_SERVER = env.VITE_API_SERVER || 'http://localhost:5000';

// API tools server URL
export const API_TOOLS_SERVER = env.VITE_API_TOOLS_SERVER || 'http://localhost:8000';

// Real folder path
export const REAL_FOLDER = env.VITE_REAL_FOLDER || 'public';

// Upload folder path
export const UPLOAD_FOLDER = env.VITE_UPLOAD_FOLDER || '/uploads';

// Root directory
export const ROOT_DIR = env.ROOT_DIR;

// Uploads folder
export const UPLOADS_FOLDER = env.UPLOADS_FOLDER ;

// Authentication
export const GOOGLE_ID = env.GOOGLE_ID || '';
export const GOOGLE_SECRET = env.GOOGLE_Secret || '';

// Environment
export const NODE_ENV = env.NODE_ENV || 'development';
