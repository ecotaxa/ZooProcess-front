// import { getTask } from "./app/api/data/task";

/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ['/', '/auth/new-verification'];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/error',
  '/auth/reset',
  '/auth/new-password',
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/settings';

// export async function GET(request: Request, { params }: { params: { taskId: string } }) {
//   const task = await getTask(params.taskId);
//   return Response.json(task);
// }

// export async function GET(
//   request: Request,
//   { params }: { params: { taskId: string } }
// ) {
//   try {
//       const task = await getTask(params.taskId)
//       return Response.json(task)
//   } catch (error) {
//       return Response.json({ error: "Task not found" }, { status: 404 })
//   }
// }
