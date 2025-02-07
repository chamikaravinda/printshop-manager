import { useState, useEffect } from "react";
import { Table, Pagination, TextInput, Button } from "flowbite-react";
import { MdClear, MdAdd, MdSearch } from "react-icons/md";
import {
  primary_button_gradient,
  secondary_button_gradient,
} from "../../utils/commonConstants";
import { deleteInvoice, getInvoices } from "../../actions/invoices.action";
import { useNavigate } from "react-router-dom";
import ConfirmationPopUp from "../../components/ConfirmationPopUp";
import ViewInvoice from "./ViewInvoice";
import { formatCurrencyToLRK } from "../../utils/commonFunction";

const Invoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [invoiceIdToDelete, setInvoiceIdToDelete] = useState("");
  const [viewingInvoice, setViewingInvoice] = useState(null);

  const [filters, setFilters] = useState({
    date: "",
    receiver: "",
    purchaseOrderNumber: "",
    invoiceNumber: "",
    invoice: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  //TODO: Change itemsPerPage to depends on screen height
  const itemsPerPage = 12;

  useEffect(() => {
    const success = (data) => {
      setInvoices(data.invoices);
      setTotalRecords(data.recordCount);
    };
    getInvoices(0, 12, filters, success);
  }, []);

  const handlePageChange = (page) => {
    const startIndex = (page - 1) * itemsPerPage;
    setCurrentPage(page);
    const success = (data) => {
      setInvoices(data.invoices);
      setTotalRecords(data.recordCount);
    };

    getInvoices(startIndex, 12, filters, success);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleSearch = () => {
    const success = (data) => {
      setInvoices(data.invoices);
      setTotalRecords(data.recordCount);
    };

    getInvoices(0, 12, filters, success);
  };

  const handleAddNewPO = () => {
    navigate("/invoice/add");
  };

  const handleDeleteInvoice = () => {
    setShowConfirmation(false);
    deleteInvoice(invoiceIdToDelete, handlePageRefresh);
  };

  const handlePageRefresh = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const success = (data) => {
      setInvoices(data.invoices);
      setTotalRecords(data.recordCount);
    };

    getInvoices(startIndex, 12, filters, success);
  };

  const handleViewInvoice = (purchaseOrder) => {
    setViewingInvoice(purchaseOrder);
  };

  const closeViewInvoice = () => {
    setViewingInvoice(null);
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
            name="invoiceNumber"
            placeholder="Filter by Invoice Number"
            value={filters.invoiceNumber}
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
          <Button
            onClick={handleSearch}
            className={`${primary_button_gradient} w-28 hover:ring-2 hover:ring-pink-900`}
          >
            <MdSearch size={18} />
            Search
          </Button>
          <Button
            onClick={() =>
              setFilters({
                date: "",
                receiver: "",
                purchaseOrderNumber: "",
                invoiceNumber: "",
              })
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
            <Table.HeadCell>Invoice Number</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Received By</Table.HeadCell>
            <Table.HeadCell>Total</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {invoices &&
              invoices.map((invoice) => (
                <Table.Row
                  key={invoice.id}
                  className="bg-white dark:bg-gray-800 dark:border-gray-600"
                >
                  <Table.Cell>{invoice.purchaseOrderNumber}</Table.Cell>
                  <Table.Cell>{invoice.invoiceNumber}</Table.Cell>
                  <Table.Cell>{invoice.date}</Table.Cell>
                  <Table.Cell>{invoice.receiver}</Table.Cell>
                  <Table.Cell>
                    {formatCurrencyToLRK(invoice.totalAmount)}
                  </Table.Cell>
                  <Table.Cell>
                    <button
                      onClick={() => handleViewInvoice(invoice)}
                      className="font-medium text-blue-500 hover:text-blue-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setShowConfirmation(true);
                        setInvoiceIdToDelete(invoice.id);
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
          {invoices.length < itemsPerPage
            ? (currentPage - 1) * itemsPerPage + invoices.length
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
        message="Are sure you want to delete this invoice"
        openModal={showConfirmation}
        falseAction={() => setShowConfirmation(false)}
        trueAction={() => handleDeleteInvoice()}
      />

      <ViewInvoice invoice={viewingInvoice} onClose={closeViewInvoice} />
    </div>
  );
};

export default Invoices;
