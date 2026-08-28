import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, useNavigate, Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore.jsx';
import './index.css';
import ProtectedRoute from './components/protectRoute.jsx';
import PublicOnlyRoute from './components/publicOnlyRoute.jsx';
import App from './App.jsx'; // This securely maps your root shell template file!
import Home from './pages/HomePage.jsx';
import Register from './pages/registerPage.jsx';
import Login from './pages/loginPage.jsx';
import OwnerLayout from './layouts/businessOwnerLayout.jsx';
 import StaffLayout from './layouts/staffLayout.jsx';
import DashboardHome from './pages/ownerOverviewdashboardPage.jsx';
import StaffManagement from './pages/staffManagementPage.jsx';
import ServerErrorPage from './pages/serverError.jsx';
import UploadInventoryPage from './pages/uploadProduct.jsx';
import ViewproductsPage from './pages/viewProducts.jsx';
import DownloadReportsPage from './pages/DownloadReport.jsx';
import BillingSubscriptionPage from './pages/subscriptionPage.jsx';
import BillingVerifyPage from './pages/verifySubscription.jsx';
import StaffDashboardHome from './pages/staffOverviewPage.jsx';
import RecordSalesPage from './pages/RecordSales.jsx';
import CheckoutReviewPage from './pages/salesCheckout.jsx';
import SalesHistoryPage from './pages/staffSales.jsx';
import ProfilePage from './pages/profilePage.jsx';
import StaffProfilePage from './pages/staffProfilePage.jsx';
import PrivacyPolicy from './pages/privacyPolicy.jsx';
import TermsOfService from './pages/TermsAndService.jsx';
const router = createBrowserRouter([
  {
    path:"/",
    element:<App />,
    children:[
      { index: true, element: <Home /> },
      { path: "/server-error", element: <ServerErrorPage /> },
      {
            path:"/privacy-policy", element:<PrivacyPolicy/>
          },
          {
            path:"/terms-of-service" , element:<TermsOfService/>
          },
      {
        element: <PublicOnlyRoute/>,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/register", element: <Register /> },
          
        ]
      },
     {
        element:  <ProtectedRoute allowedRoles={["OWNER"]} />, 
        children: [
          {
            path: "/admin-dashboard",
            element: <OwnerLayout />,
            children: [
              { index: true, element: <DashboardHome /> },
              { path: "staff", element: <StaffManagement /> },
              { path: "add-inventory", element: <UploadInventoryPage /> },
              { path: "view-inventory", element: <ViewproductsPage /> },
              { path: "financials", element: <DownloadReportsPage /> },
              { path: "billing", element: <BillingSubscriptionPage /> },
              { path: "billing/verify", element: <BillingVerifyPage /> },
              {path:"profile", element:<ProfilePage/>}
            ]
          }
         
        ]
      },
      // =========================================================================
      // 🔒 2. COUNTER CASHIER TRANSACTION ZONE (Strictly restricted to STAFF)
      // ========================================================================
      {
        element:<ProtectedRoute allowedRoles={["STAFF"]} />,
        children:[
           {
            path:"/staff-dashboard",
            element:<StaffLayout/>,
            children:[
              {index:true, element:<StaffDashboardHome/>},
              {path:"record-sales", element:<RecordSalesPage/>},
              {path:"checkout-review", element:<CheckoutReviewPage/>},
              {path:"sales", element:<SalesHistoryPage/>},
              {path:"profile", element:<StaffProfilePage/>}
            ]
          }
        ]
      },

       { path: "*", element: <Navigate to="/login" replace /> }
          ]
        }
      ]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
