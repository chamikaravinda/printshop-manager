import { Link } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUser,
  HiChartPie,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { signOut } from "../actions/user.action";
import {USER_ROLE_ADMIN} from "../utils/commonConstants"

export default function DashboardSidebar() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Sidebar className="h-screen w-full md:w-56 shadow-lg">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {" "}
          <Link to="/dashboard">
            <Sidebar.Item icon={HiChartPie} labelColor="dark" as="div">
              Dashboard
            </Sidebar.Item>
          </Link>
          {currentUser.userRole === USER_ROLE_ADMIN && (
            <>
              <Sidebar.Collapse icon={HiDocumentText} label="Orders">
                <Sidebar.Item href="/dashboard">All Orders</Sidebar.Item>
                <Sidebar.Item href="/create-order">Create Order</Sidebar.Item>
              </Sidebar.Collapse>
              <Link to="/users">
                <Sidebar.Item icon={HiOutlineUser} labelColor="dark" as="div">
                  Users
                </Sidebar.Item>
              </Link>
            </>
          )}
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={signOut}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
