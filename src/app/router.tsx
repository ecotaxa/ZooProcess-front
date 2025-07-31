import React from 'react';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';

// Import layouts and pages
import RootLayout from './layout.tsx';
import { LoginPage } from './features/login/page.tsx';
import { DashboardPage } from './features/dashboard/page.tsx';
import { SubsampleViewPage } from './features/subsample/view/page.tsx';
import { AuthProvider, useAuth } from 'app/stores/auth-context.tsx';
import { SubsampleProcessPage } from 'app/features/subsample/process/page.tsx';
import { SubsampleProcessTimeline } from 'app/features/subsample/process/timeline.tsx';

// import Custom404 from '../../app/pages/404.tsx';
// Protected routes
// import ProjectsPage from '../../app/[locale]/(protected)/projects/page.tsx';

// Protected route wrapper
const ProtectedRoute = () => {
  // Use the auth context to check if user is authenticated
  const { authState } = useAuth();
  const isAuthenticated = !!authState.accessToken;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// Create the router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <RootLayout>
          <Outlet />
        </RootLayout>
      </AuthProvider>
    ),
    children: [
      // {
      //   index: true,
      //   element: <HomePage />,
      // },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'dashboard',
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
        ],
      },
      {
        path: 'project/:projectId/sample/:sampleId/subsample/:subsampleId/',
        element: <ProtectedRoute />,
        children: [
          {
            path: 'View',
            element: <SubsampleViewPage />,
          },
          {
            path: 'Process',
            // TODO: Redirect to one of process pages depending on scan state
            element: <SubsampleProcessTimeline current={0} list={undefined} />,
          },
        ],
      },

      //   {
      //     path: 'projects',
      //     element: <ProtectedRoute />,
      //     children: [
      //       {
      //         index: true,
      //         element: <ProjectsPage />,
      //       },
      //       {
      //         path: ':projectId',
      //         element: <Outlet />,
      //         children: [
      //           {
      //             index: true,
      //             element: <div>Project Details</div>, // Replace with actual component
      //           },
      //           {
      //             path: 'samples',
      //             element: <Outlet />,
      //             children: [
      //               {
      //                 index: true,
      //                 element: <div>Samples List</div>, // Replace with actual component
      //               },
      //               {
      //                 path: ':sampleId',
      //                 element: <Outlet />,
      //                 children: [
      //                   {
      //                     index: true,
      //                     element: <div>Sample Details</div>, // Replace with actual component
      //                   },
      //                   {
      //                     path: 'subsamples',
      //                     element: <Outlet />,
      //                     children: [
      //                       {
      //                         index: true,
      //                         element: <div>Subsamples List</div>, // Replace with actual component
      //                       },
      //                       {
      //                         path: ':subsampleId',
      //                         element: <Outlet />,
      //                         children: [
      //                           {
      //                             index: true,
      //                             element: <div>Subsample Details</div>, // Replace with actual component
      //                           },
      //                           {
      //                             path: 'process',
      //                             element: <div>Process</div>, // Replace with actual component
      //                           },
      //                         ],
      //                       },
      //                     ],
      //                   },
      //                 ],
      //               },
      //             ],
      //           },
      //         ],
      //       },
      //     ],
      //   },
    ],
  },
  // {
  //   path: '*',
  //   element: <Custom404 />, // Using the Custom404 component for not found routes
  // },
]);

// Router component to be used in app.tsx
export function Router() {
  return <RouterProvider router={router} />;
}
