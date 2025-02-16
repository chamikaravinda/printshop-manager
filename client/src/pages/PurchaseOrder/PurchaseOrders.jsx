import { useState, useEffect } from "react";
import {
  Table,
  Pagination,
  TextInput,
  Button,
  Datepicker,
} from "flowbite-react";
import { MdClear, MdAdd, MdSearch } from "react-icons/md";
import {
  primary_button_gradient,
  secondary_button_gradient,
} from "../../utils/commonConstants";
import {
  deletePurchaseOrders,
  getPurchaseOrders,
} from "../../actions/purchase-order.action";
import { useNavigate } from "react-router-dom";
import ConfirmationPopUp from "../../components/ConfirmationPopUp";
import ViewPurchaseOrder from "./ViewPurchaseOrder";
import { formatCurrencyToLRK } from "../../utils/commonFunction";
import { format } from "date-fns";

const PurchaseOrders = () => {
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderIdToDelete, setOrderIdToDelete] = useState("");
  const [viewingPurchaseOrder, setViewingPurchaseOrder] = useState(null);

  const [filters, setFilters] = useState({
    date: "",
    receiver: "",
    purchaseOrderNumber: "",
    order: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  //TODO: Change itemsPerPage to depends on screen height
  const itemsPerPage = 12;

  useEffect(() => {
    const success = (data) => {
      setPurchaseOrders(data.purchaseOrders);
      setTotalRecords(data.recordCount);
    };
    getPurchaseOrders(0, 12, filters, success);
  }, []);

  const handlePageChange = (page) => {
    const startIndex = (page - 1) * itemsPerPage;
    setCurrentPage(page);
    const success = (data) => {
      setPurchaseOrders(data.purchaseOrders);
      setTotalRecords(data.recordCount);
    };

    getPurchaseOrders(startIndex, 12, filters, success);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      date: format(date, "dd/MM/yyyy"),
    }));
  };

  const handleSearch = () => {
    const success = (data) => {
      setPurchaseOrders(data.purchaseOrders);
      setTotalRecords(data.recordCount);
    };

    getPurchaseOrders(0, 12, filters, success);
  };

  const handleAddNewPO = () => {
    navigate("/purchase-order/add");
  };

  const handleDeletePO = () => {
    setShowConfirmation(false);
    deletePurchaseOrders(orderIdToDelete, handlePageRefresh);
  };

  const handlePageRefresh = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const success = (data) => {
      setPurchaseOrders(data.purchaseOrders);
      setTotalRecords(data.recordCount);
    };

    getPurchaseOrders(startIndex, 12, filters, success);
  };

  const handleViewPO = (purchaseOrder) => {
    setViewingPurchaseOrder(purchaseOrder);
  };

  const closeViewPO = () => {
    setViewingPurchaseOrder(null);
  };

  return (
    <div
      className="p-4 flex flex-col"
      style={{ height: "calc(100vh - 60px)", width: "calc(100vw - 250px)" }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 items-center">
          <TextInput
            name="purchaseOrderNumber"
            placeholder="Filter by PO Number"
            value={filters.purchaseOrderNumber}
            onChange={handleInputChange}
          />
          <Datepicker
            id="date"
            name="date"
            value={filters.date}
            onSelectedDateChanged={handleDateChange}
            format="dd/MM/yyyy"
            placeholder="Filter by Date"
          />
          <TextInput
            name="receiver"
            placeholder="Filter by Receiver"
            value={filters.receiver}
            onChange={handleInputChange}
          />
          <Button
            onClick={handleSearch}
            className={`${primary_button_gradient} w-28 hover:ring-2 hover:ring-pink-900`}
          >
            <MdSearch size={18} />
            Search
          </Button>
          <Button
            onClick={() =>
              setFilters({ date: "", receiver: "", purchaseOrderNumber: "" })
            }
            className={`${secondary_button_gradient} w-28 hover:ring-2 hover:ring-pink-900`}
          >
            <MdClear size={18} />
            Clear
          </Button>
        </div>

        <Button
          onClick={handleAddNewPO}
          className={`${primary_button_gradient} min-w-28 hover:ring-2 hover:ring-pink-900`}
        >
          <MdAdd size={18} />
          Add PO
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Table hoverable className="w-full table-auto shadow-md">
          <Table.Head>
            <Table.HeadCell>PO Number</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Ordered By</Table.HeadCell>
            <Table.HeadCell>Total</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {purchaseOrders &&
              purchaseOrders.map((order) => (
                <Table.Row
                  key={order.id}
                  className="bg-white dark:bg-gray-800 dark:border-gray-600"
                >
                  <Table.Cell>{order.purchaseOrderNumber}</Table.Cell>
                  <Table.Cell>{order.date}</Table.Cell>
                  <Table.Cell>{order.orderedBy}</Table.Cell>
                  <Table.Cell>
                    {formatCurrencyToLRK(order.orderTotal)}
                  </Table.Cell>
                  <Table.Cell>
                    <button
                      onClick={() => handleViewPO(order)}
                      className="font-medium text-blue-500 hover:text-blue-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setShowConfirmation(true);
                        setOrderIdToDelete(order.id);
                      }}
                      className="ml-4 font-medium text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>

      <div className="mt-4 text-sm">
        <span>
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {purchaseOrders.length < itemsPerPage
            ? (currentPage - 1) * itemsPerPage + purchaseOrders.length
            : currentPage * itemsPerPage}{" "}
          of {totalRecords} Entries
        </span>
      </div>

      <Pagination
        currentPage={currentPage}
        onPageChange={(page) => handlePageChange(page)}
        totalPages={Math.ceil(totalRecords / itemsPerPage) || 0}
        className="mt-4"
      />

      <ConfirmationPopUp
        message="Are sure you want to delete this purchase order"
        openModal={showConfirmation}
        falseAction={() => setShowConfirmation(false)}
        trueAction={() => handleDeletePO()}
      />

      <ViewPurchaseOrder
        purchaseOrder={viewingPurchaseOrder}
        onClose={closeViewPO}
      />
    </div>
  );
};

export default PurchaseOrders;
