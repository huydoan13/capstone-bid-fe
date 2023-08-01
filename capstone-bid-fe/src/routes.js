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
import SignUp from './pages/SignUp';
import AddProduct from './pages/AddProduct';
import AuctionPage from './pages/AuctionPage';
import Profile from './pages/Profile';
import PrepareSession from './pages/PrepareSession';
import InstageSession from './pages/InstageSession';
import FinishSession from './pages/FinishSession';
// import StaffPage from './pages/StaffPage';
import StaffPage from './pages/StaffPage';
import CategoryPage from './pages/CategoryPage';
import SessionPage from './pages/SessionPage';
import ItemPage from './pages/ItemPage';
import CategoryCreate from './sections/@dashboard/category/CategoryCreate';
import { RolesAuthRoute } from './context/RolesAuthRoute';
import UserWaitingApprove from './pages/UserWaitingApprove';
import UserBan from './pages/UserBan';
import UserDetail from './sections/@dashboard/user/UserDetail';
import UserWaitingDetail from './sections/@dashboard/user/UserWaitingDetail';
import BookingItemsPage from './pages/BookingItems';
import AllBookingItemPage from './pages/AllBookingItem';
import SessionNotPayPage from './pages/SessionNotPay';
import SessionOutOfDatePage from './pages/SessionOutOfDate';
import SessionCreate from './sections/@dashboard/session/SessionCreate';
import SessionSuccessPage from './pages/SessionSuccess';
import SessionRulePage from './pages/SessionRule';
import FeePage from './pages/FeePage';
import { StaffCreateNew } from './sections/staff';
import BookingItemNoSe from './pages/BookingItemNoSe';
import BookingItemDetail from './sections/@dashboard/booking-item/BookingItemDetail';
import ItemDetail from './sections/@dashboard/itemss/ItemDetail';
import UserBanDetail from './sections/@dashboard/user/UserBanDetail';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    // { path: 'home', element: (
    //   <Suspense>
    //     <RolesAuthRoute roles={['Admin', 'Staff', 'Auctioneer', 'Bidder']}>
    //       <HomePage />
    //     </RolesAuthRoute>
    //   </Suspense>
    // ), },
    { path: 'auction', element: <AuctionPage /> },
    { path: 'signup', element: <SignUp /> },
    { path: 'addproduct', element: <AddProduct /> },
    { path: 'profile', element: <Profile /> },
    { path: 'home', element: <HomePage />},
    { path: 'prepare', element: <PrepareSession />},
    { path: 'instage', element: <InstageSession />},
    { path: 'finish', element: <FinishSession />},
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
          path: 'user',
          element: <UserPage />,
        },
        { path: 'user-waiting', element: <UserWaitingApprove /> },
        { path: 'user-ban', element: <UserBan /> },
        { path: 'user-detail/:userId', element: <UserDetail /> },
        { path: 'user-waiting-detail/:userId', element: <UserWaitingDetail /> },
        { path: 'user-ban-detail/:userId', element: <UserBanDetail /> },
        // { path: 'products', element: <ProductsPage /> },
        // { path: 'blog', element: <BlogPage /> },
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
        {
          path: 'staff-create',
          element: (
            <Suspense>
              <RolesAuthRoute roles={['Admin']}>
                <StaffCreateNew />
              </RolesAuthRoute>
            </Suspense>
          ),
        },
        {
          path: 'category',
          element: (
            <Suspense>
              <RolesAuthRoute roles={['Admin']}>
                <CategoryPage />
              </RolesAuthRoute>
            </Suspense>
          ),
        },
        {
          path: 'session-rule',
          element: (
            <Suspense>
              <RolesAuthRoute roles={['Admin']}>
                <SessionRulePage />
              </RolesAuthRoute>
            </Suspense>
          ),
        },
        {
          path: 'fee',
          element: (
            <Suspense>
              <RolesAuthRoute roles={['Admin']}>
                <FeePage />
              </RolesAuthRoute>
            </Suspense>
          ),
        },
        { path: 'item-type-create', element: <CategoryCreate /> },
        { path: 'sessions', element: <SessionPage /> },
        { path: 'session-success', element: <SessionSuccessPage /> },
        { path: 'session-not-pay', element: <SessionNotPayPage /> },
        { path: 'session-out-of-date', element: <SessionOutOfDatePage /> },
        { path: 'session-create/:itemId', element: <SessionCreate /> },
        { path: 'items', element: <ItemPage /> },
        { path: 'item-detail/:itemId', element: <ItemDetail /> },
        { path: 'booking-item-detail/:bookingItemId', element: <BookingItemDetail /> },
        {
          path: 'booking-items',
          element: (
            <Suspense>
              <RolesAuthRoute roles={['Staff']}>
                <BookingItemsPage />
              </RolesAuthRoute>
            </Suspense>
          ),
        },
        {
          path: 'booking-item-no-session',
          element: (
            <Suspense>
              <RolesAuthRoute roles={['Staff']}>
                <BookingItemNoSe />
              </RolesAuthRoute>
            </Suspense>
          ),
        },
        {
          path: 'all-booking-items',
          element: (
            <Suspense>
              <RolesAuthRoute roles={['Admin']}>
                <AllBookingItemPage />
              </RolesAuthRoute>
            </Suspense>
          ),
        },
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
