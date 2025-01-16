import DashboardSidebar from "./DashboardSidebar";
import PropTypes from "prop-types";

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <DashboardSidebar />
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired, // Ensures that children are provided
};
