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
import SessionInStagePage from './pages/SessionInStage';
import SessionErrorItemPage from './pages/SessionErrorItem';
import SessionReceivedPage from './pages/SessionReceived';
import SessionCreate from './sections/@dashboard/session/SessionCreate';
import SessionSuccessPage from './pages/SessionSuccess';
import SessionRulePage from './pages/SessionRule';
import FeePage from './pages/FeePage';
import { StaffCreateNew } from './sections/staff';
import BookingItemNoSe from './pages/BookingItemNoSe';
import MyProductPage from './pages/MyProductPage';
import MySessionPage from './pages/MySessionPage';
import MyHistoryPage from './pages/MyHistoryPage';
import BookingItemDetail from './sections/@dashboard/booking-item/BookingItemDetail';
import ItemDetail from './sections/@dashboard/itemss/ItemDetail';
import UserBanDetail from './sections/@dashboard/user/UserBanDetail';
import FeeCreate from './sections/@dashboard/fee/FeeCreate';
import SessionRuleCreate from './sections/@dashboard/session-rule/SessionRuleCreate';
import SessionDetail from './sections/@dashboard/session/SessionDetail';
import ShoppingCartPage from './pages/ShoppingCartPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailPage from './pages/PaymentFailPage';
import PaymentSuccessJoinPage from './pages/PaymentSuccessJoinPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import Reauction from './pages/Reauction';
import Test from './pages/test';
import BookingItemNow from './pages/BookingItemNow';
import SessionCreateNow from './sections/@dashboard/session/SessionCreateNow';
import BookingItemDetailNow from './sections/@dashboard/booking-item/BookingItemDetailNow';
import SessionNotStart from './pages/SessionNotStart';
import SessionHistory from './sections/@dashboard/session/SessionHistory';
import PaymentManage from './pages/PaymentManage';
import PaymentUserDetail from './sections/@dashboard/user/PaymentUserDetail';
import StaffProfile from './sections/staff/StaffProfile';
import UpdateItem from './pages/UpdateItem';
import ReItem from './pages/ReItem';


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
    { path: 'auction/:sessionId', element: (
      <Suspense>
        <RolesAuthRoute roles={['Admin', 'Staff', 'User']}>
          <AuctionPage />
        </RolesAuthRoute>
      </Suspense>
    ), },
    { path: 'signup', element: <SignUp /> },
    { path: 'additem', element: (
      <Suspense>
        <RolesAuthRoute roles={['User']}>
          <AddProduct />
        </RolesAuthRoute>
      </Suspense>
    ), },
    { path: 'profile', element: (
      <Suspense>
        <RolesAuthRoute roles={['User']}>
          <Profile />
        </RolesAuthRoute>
      </Suspense>
    ), },
    { path: 'home', element: <HomePage />},
    { path: 'prepare', element: <PrepareSession />},
    { path: 'instage',element: (
      <Suspense>
        <RolesAuthRoute roles={[ 'User']}>
          <InstageSession />
        </RolesAuthRoute>
      </Suspense>
    ),},
    { path: 'finish', element: <FinishSession />},
    { path: 'myitem',element: (
      <Suspense>
        <RolesAuthRoute roles={[ 'User']}>
          <MyProductPage />
        </RolesAuthRoute>
      </Suspense>
    ),},
    { path: 'mysession', element: (
      <Suspense>
        <RolesAuthRoute roles={[ 'User']}>
          <MySessionPage />
        </RolesAuthRoute>
      </Suspense>
    ),},
    { path: 'myhistory', element: (
      <Suspense>
        <RolesAuthRoute roles={[ 'User']}>
          <MyHistoryPage />
        </RolesAuthRoute>
      </Suspense>
    ),},
    { path: 'shoppingcart', element: (
      <Suspense>
        <RolesAuthRoute roles={[ 'User']}>
          <ShoppingCartPage />
        </RolesAuthRoute>
      </Suspense>
    ),},
    { path: 'payment-join-success', element: <PaymentSuccessJoinPage />},
    { path: 'payment-success', element: <PaymentSuccessPage />},
    { path: 'payment-fail', element: <PaymentFailPage />},
    { path: 'payment-history', element: (
      <Suspense>
        <RolesAuthRoute roles={[ 'User']}>
          <TransactionHistoryPage />
        </RolesAuthRoute>
      </Suspense>
    ),},
    { path: 're-auction/:itemId', element: (
      <Suspense>
        <RolesAuthRoute roles={[ 'User']}>
          <Reauction />
        </RolesAuthRoute>
      </Suspense>
    ), },
    { path: 'update-item/:itemId', element: (
      <Suspense>
        <RolesAuthRoute roles={[ 'User']}>
          <UpdateItem />
        </RolesAuthRoute>
      </Suspense>
    ), },
    { path: 're-item/:itemId', element: (
      <Suspense>
        <RolesAuthRoute roles={[ 'User']}>
          <ReItem />
        </RolesAuthRoute>
      </Suspense>
    ), },
    { path: 'test', element: <Test /> },

    
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
        { path: 'payment-manage', element: <PaymentManage /> },
        { path: 'payment-user-detail/:userId', element: <PaymentUserDetail /> },
        { path: 'user-detail/:userId', element: <UserDetail /> },
        { path: 'user-waiting-detail/:userId', element: <UserWaitingDetail /> },
        { path: 'user-ban-detail/:userId', element: <UserBanDetail /> },
        { path: 'staff-profile', element: <StaffProfile /> },
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
        { path: 'session-rule-create', element: <SessionRuleCreate /> },
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
        { path: 'fee-create', element: <FeeCreate /> },
        { path: 'item-type-create', element: <CategoryCreate /> },
        { path: 'sessions', element: <SessionPage /> },
        { path: 'session-detail/:sessionId', element: <SessionDetail /> },
        { path: 'session-history/:sessionId', element: <SessionHistory /> },
        { path: 'session-success', element: <SessionSuccessPage /> },
        { path: 'session-not-pay', element: <SessionNotPayPage /> },
        { path: 'session-out-of-date', element: <SessionOutOfDatePage /> },
        { path: 'session-instage', element: <SessionInStagePage /> },
        { path: 'session-not-start', element: <SessionNotStart /> },
        { path: 'session-error-item', element: <SessionErrorItemPage /> },
        { path: 'session-received', element: <SessionReceivedPage /> },
        { path: 'session-create/:itemId', element: <SessionCreate /> },
        { path: 'session-create-now/:itemId', element: <SessionCreateNow /> },
        { path: 'items', element: <ItemPage /> },
        { path: 'item-detail/:itemId', element: <ItemDetail /> },
        { path: 'booking-item-detail/:bookingItemId', element: <BookingItemDetail /> },
        { path: 'booking-item-detail-now/:bookingItemId', element: <BookingItemDetailNow /> },
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
          path: 'booking-item-now',
          element: (
            <Suspense>
              <RolesAuthRoute roles={['Staff']}>
                <BookingItemNow />
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
