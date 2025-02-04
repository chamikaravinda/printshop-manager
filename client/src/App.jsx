import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";
import CommonNotifier from "./components/CommonNotifier";
import {
  PrivateRoute,
  OnlyAdminPrivateRoute,
  AuthRoute,
  AdminDashboardPrivateRoute,
} from "./components/PrivateRoute";
import SignIn from "./pages/PublicPages/SignIn";
import SignUp from "./pages/PublicPages/SignUp";
import Home from "./pages/PublicPages/Home";
import Users from "./pages/User/Users";
import Profile from "./pages/User/Profile";
import Dashboard from "./pages/Dashboard/Dashboard";
import NotFound from "./pages/PublicPages/NotFound";
import PurchaseOrders from "./pages/PurchaseOrder/PurchaseOrders";
import AddPurchaseOrder from "./pages/PurchaseOrder/AddPurchaseOrder";
import UpdatePurchaseOrder from "./pages/PurchaseOrder/UpdatePurchaseOrder";
import DeliveryNotes from "./pages/DeliveryNote/DeliveryNotes";
import AddDeliveryNote from "./pages/DeliveryNote/AddDeliveryNote";
import UpdateDeliveryNote from "./pages/DeliveryNote/UpdateDeliveryNote";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <CommonNotifier />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<AuthRoute />}>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          {/* <Route path="/route" element={<Dashboard />} /> */}
        </Route>
        <Route element={<AdminDashboardPrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/purchase-order/add" element={<AddPurchaseOrder />} />
          <Route path="/purchase-order/update/:id" element={<UpdatePurchaseOrder />} />
          <Route path="/delivery-notes" element={<DeliveryNotes />} />
          <Route path="/delivery-note/add" element={<AddDeliveryNote />} />
          <Route path="/delivery-note/update/:id" element={<UpdateDeliveryNote />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
