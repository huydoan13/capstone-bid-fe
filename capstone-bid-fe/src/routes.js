import { Navigate, useRoutes, Route } from 'react-router-dom';
import { Suspense } from 'react';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import StaffPage from './pages/StaffPage';
import CategoryPage from './pages/CategoryPage';
import SessionPage from './pages/SessionPage';
import ItemPage from './pages/ItemPage';
import ItemTypeCreate from './sections/@dashboard/category/CategoryCreate';
import { RolesAuthRoute } from './context/RolesAuthRoute';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        {
          path: 'user',
          element: (
            <Suspense>
              <RolesAuthRoute roles={['Admin']}>
                <UserPage />
              </RolesAuthRoute>
            </Suspense>
          ),
        },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'staff', element: <StaffPage /> },
        { path: 'category', element: <CategoryPage /> },
        { path: 'item-type-create', element: <ItemTypeCreate /> },
        { path: 'sessions', element: <SessionPage /> },
        { path: 'items', element: <ItemPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}

// const withAuth = (Component) => {
//   const AuthenticatedComponent = (props) => {
//     const token = localStorage.getItem('token');

//     if (!token) {
//       // Redirect to login page if token is not present
//       return <Navigate to="/login" />;
//     }

//     try {
//       // Verify the token's validity
//       jwt.verify(token, 'secret_key');
//       // Render the protected component if the token is valid
//       return <Component {...props} />;
//     } catch (error) {
//       // Redirect to login page if token is invalid or expired
//       return <Navigate to="/login" />;
//     }
//   };

//   return AuthenticatedComponent;
// };

// const ProtectedRoute = withAuth(({ component: Component, ...rest }) => {
//   return <Route {...rest} render={(props) => <Component {...props} />} />;
// });
