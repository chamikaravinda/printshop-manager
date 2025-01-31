import { useState, useEffect } from "react";
import { Table, Pagination, TextInput, Button } from "flowbite-react";
import { MdClear, MdAdd, MdSearch } from "react-icons/md";
import {
  blue_gradient,
  green_gradient,
  red_gradient,
} from "../utils/commonConstants";
import { getPurchaseOrders } from "../actions/purchase-order.action";

const PurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const [filters, setFilters] = useState({
    date: "",
    receiver: "",
    purchaseOrderNumber: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const success = (data) => {
      setPurchaseOrders(data.purchaseOrders);
      setTotalRecords(data.recordCount);
    };
    getPurchaseOrders(0,12, success);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const startRecord = 1;
  const endRecord = 15;

  const handleSearch = () => {
    alert("Search clicked!");
  };

  const handleAddNewPO = () => {
    alert("Add New PO clicked!");
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
          <TextInput
            name="date"
            placeholder="Filter by Date"
            value={filters.date}
            onChange={handleInputChange}
          />
          <TextInput
            name="receiver"
            placeholder="Filter by Receiver"
            value={filters.receiver}
            onChange={handleInputChange}
          />
          <Button onClick={handleSearch} className={`${blue_gradient} w-28`}>
            <MdSearch size={18} />
            Search
          </Button>
          <Button
            onClick={() =>
              setFilters({ date: "", receiver: "", purchaseOrderNumber: "" })
            }
            className={`${red_gradient} w-28`}
          >
            <MdClear size={18} />
            Clear
          </Button>
        </div>

        <Button onClick={handleAddNewPO} className={`${green_gradient} w-28`}>
          <MdAdd size={18} />
          Add PO
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Table className="w-full table-auto">
          <Table.Head>
            <Table.HeadCell>Purchase Order Number</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Ordered By</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {purchaseOrders &&
              purchaseOrders.map((order) => (
                <Table.Row key={order.id} className="bg-white">
                  <Table.Cell>{order.purchaseOrderNumber}</Table.Cell>
                  <Table.Cell>{order.date}</Table.Cell>
                  <Table.Cell>{order.orderedBy}</Table.Cell>
                  <Table.Cell>
                    <button
                      onClick={() => alert(`View details for ${order.id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => alert(`Delete ${order.id}`)}
                      className="ml-4 text-red-600 hover:underline"
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
          Showing {startRecord} to {endRecord} of {totalRecords} Entries
        </span>
      </div>

      <Pagination
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
        totalPages={Math.ceil(totalRecords / 12) || 0}
        className="mt-4"
      />
    </div>
  );
};

export default PurchaseOrders;
