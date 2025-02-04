import { Link } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUser,
  HiChartPie,
} from "react-icons/hi";
import { MdOutlineEditNote } from "react-icons/md";
import { useSelector } from "react-redux";
import { signOut } from "../actions/user.action";
import { USER_ROLE_ADMIN } from "../utils/commonConstants";

export default function DashboardSidebar() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Sidebar
      className="w-56 shadow-lg"
      style={{ height: "calc(100vh - 60px)" }}
    >
      <Sidebar.Items className="flex flex-col h-5/6">
        <Sidebar.ItemGroup className="flex flex-col gap-1 flex-grow">
          {" "}
          <Link to="/dashboard">
            <Sidebar.Item icon={HiChartPie} labelColor="dark" as="div">
              Dashboard
            </Sidebar.Item>
          </Link>
          {currentUser.userRole === USER_ROLE_ADMIN && (
            <>
              <Sidebar.Collapse icon={HiDocumentText} label="Purchase Orders">
                <Sidebar.Item href="/purchase-orders">All Orders</Sidebar.Item>
                <Sidebar.Item href="/purchase-order/add">
                  Create Order
                </Sidebar.Item>
              </Sidebar.Collapse>
              <Sidebar.Collapse icon={MdOutlineEditNote} label="Delivery Notes">
                <Sidebar.Item href="/delivery-notes">All Notes</Sidebar.Item>
                <Sidebar.Item href="/delivery-note/add">
                  Create Note
                </Sidebar.Item>
              </Sidebar.Collapse>
              <Link to="/users">
                <Sidebar.Item icon={HiOutlineUser} labelColor="dark" as="div">
                  Users
                </Sidebar.Item>
              </Link>
            </>
          )}
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup className="absolute inset-x-0 bottom-0 w-56">
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
