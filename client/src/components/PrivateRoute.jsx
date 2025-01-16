import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import {USER_ROLE_ADMIN} from "../utils/commonConstants"

export const AuthRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ? <Navigate to="/" /> : <Outlet />;
};

export const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ? <Outlet /> : <Navigate to="/" />;
};

export const OnlyAdminPrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && currentUser.userRole === USER_ROLE_ADMIN ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};

export const AdminDashboardPrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && currentUser.userRole === USER_ROLE_ADMIN ? (
    <DashboardLayout><Outlet /></DashboardLayout>
  ) : (
    <Navigate to="/" />
  );
};