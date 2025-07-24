import React from 'react';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';

// Import layouts and pages
// Note: These imports will need to be updated based on the actual file structure
import RootLayout from './app/layout.tsx';
import LocaleLayout from './app/[locale]/layout.tsx';
import HomePage from './app/[locale]/page.tsx';
import LoginPage from './app/[locale]/auth/login/page.tsx';
import DocsPage from './app/[locale]/docs/page.tsx';

// Protected routes
import ProjectsPage from './app/[locale]/(protected)/projects/page.tsx';

// Protected route wrapper
const ProtectedRoute = () => {
  // This is a simplified version - you'll need to implement actual auth checking
  const isAuthenticated = true; // Replace with actual auth check

  if (!isAuthenticated) {
    return <Navigate to="/en/auth/login" replace />;
  }

  return <Outlet />;
};

// Create the router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/en" replace />,
  },
  {
    path: '/:locale',
    element: (
      // <AuthProvider>
      <LocaleLayout>
        <Outlet />
      </LocaleLayout>
      // </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'auth/login',
        element: <LoginPage />,
      },
      {
        path: 'docs',
        element: <DocsPage />,
      },
      {
        path: 'projects',
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <ProjectsPage />,
          },
          {
            path: ':projectId',
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <div>Project Details</div>, // Replace with actual component
              },
              {
                path: 'samples',
                element: <Outlet />,
                children: [
                  {
                    index: true,
                    element: <div>Samples List</div>, // Replace with actual component
                  },
                  {
                    path: ':sampleId',
                    element: <Outlet />,
                    children: [
                      {
                        index: true,
                        element: <div>Sample Details</div>, // Replace with actual component
                      },
                      {
                        path: 'subsamples',
                        element: <Outlet />,
                        children: [
                          {
                            index: true,
                            element: <div>Subsamples List</div>, // Replace with actual component
                          },
                          {
                            path: ':subsampleId',
                            element: <Outlet />,
                            children: [
                              {
                                index: true,
                                element: <div>Subsample Details</div>, // Replace with actual component
                              },
                              {
                                path: 'process',
                                element: <div>Process</div>, // Replace with actual component
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <div>Not Found</div>, // Replace with actual 404 component
  },
]);

// Router component to be used in main.tsx
export function Router() {
  return <RouterProvider router={router} />;
}

export default router;
