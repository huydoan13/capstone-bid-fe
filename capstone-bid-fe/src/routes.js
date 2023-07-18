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
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import AddProduct from './pages/AddProduct';
import AuctionPage from './pages/AuctionPage';
import Profile from './pages/Profile';
// import StaffPage from './pages/StaffPage';
import StaffPage from './pages/StaffPage';
import CategoryPage from './pages/CategoryPage';
import SessionPage from './pages/SessionPage';
import ItemPage from './pages/ItemPage';
import ItemTypeCreate from './sections/@dashboard/category/CategoryCreate';
import { RolesAuthRoute } from './context/RolesAuthRoute';
import UserWaitingApprove from './pages/UserWaitingApprove';
import UserBan from './pages/UserBan';
import UserDetail from './sections/@dashboard/user/UserDetail';
import BookingItems from './pages/BookingItems';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    { path: 'home', element: <HomePage /> },
    { path: 'auction', element: <AuctionPage /> },
    { path: 'signup', element: <SignUp /> },
    { path: 'addproduct', element: <AddProduct /> },
    { path: 'profile', element: <Profile /> },
    { path: 'landing', element: <LandingPage />},
    {
      path: '/dashboard',
      element: (
        <Suspense>
          <RolesAuthRoute roles={['Admin', 'Staff']}>
            <DashboardLayout />
          </RolesAuthRoute>
        </Suspense>
      ),
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },

        { path: 'app', element: <DashboardAppPage /> },
        {
          path: 'user', element: <UserPage />,
        },
        { path: 'user-waiting', element: <UserWaitingApprove /> },
        { path: 'user-ban', element: <UserBan /> },
        { path: 'user-detail', element: <UserDetail /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        {
          path: 'staff',
          element: (
            <Suspense>
              <RolesAuthRoute roles={['Admin']}>
                <StaffPage />
              </RolesAuthRoute>
            </Suspense>
          ),
        },
        { path: 'category', element: <CategoryPage /> },
        { path: 'item-type-create', element: <ItemTypeCreate /> },
        { path: 'sessions', element: <SessionPage /> },
        { path: 'items', element: <ItemPage /> },
        { path: 'booking-items', element: <BookingItems /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/home" />, index: true },
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
