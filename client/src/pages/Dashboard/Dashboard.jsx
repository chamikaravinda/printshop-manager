import { useEffect, useState } from "react";
import { getInvoices } from "../../actions/invoices.action";
import { Badge, Pagination, Table } from "flowbite-react";
import { formatCurrencyToLRK } from "../../utils/commonFunction";
import { differenceInDays, parse } from "date-fns";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";
import { primary_gradient } from "../../utils/commonConstants";
import { getDasahboardDetails } from "../../actions/dashboard.action";
import { GrDocumentPerformance } from "react-icons/gr";
import { GiReceiveMoney } from "react-icons/gi";
import { MdAttachMoney } from "react-icons/md";

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [overdueTotal, setoverdueTotal] = useState(0);
  const [pendingTotal, setPendingTotal] = useState(0);

  const itemsPerPage = 10;
  const filters = {
    paid: false,
  };

  useEffect(() => {
    const getInvoicesSuccess = (data) => {
      setInvoices(data.invoices);
      setTotalRecords(data.recordCount);
    };

    const getDasahboardDetailsSuccess = (data) => {
      setoverdueTotal(data.overdueTotal);
      setPendingTotal(data.unpaidTotal);
    };
    getDasahboardDetails(getDasahboardDetailsSuccess);
    getInvoices(0, itemsPerPage, filters, getInvoicesSuccess);
  }, []);

  const handlePageChange = (page) => {
    const startIndex = (page - 1) * itemsPerPage;
    setCurrentPage(page);
    const success = (data) => {
      setInvoices(data.invoices);
      setTotalRecords(data.recordCount);
    };

    getInvoices(startIndex, itemsPerPage, filters, success);
  };

  const calculateDateDifference = (date) => {
    date = parse(date, "dd/MM/yyyy", new Date());
    return differenceInDays(new Date(), date);
  };

  return (
    <div className="xl:p-20 lg:p-10 flex flex-col overflow-hidden">
      <div className="flex flex-wrap gap-4 pb-4 xl:pb-10 xl:justify-between lg:justify-center">
        <div
          className={`${primary_gradient} shadow-md rounded-lg p-5 w-64 text-center flex items-center`}
        >
          <GrDocumentPerformance className="text-gray-50 dark:text-gray-50 text-6xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold text-gray-50 dark:text-gray-50">
              Unpaid Invoices
            </h2>
            <p className="text-5xl font-bold text-gray-50 dark:text-gray-50 mt-2">
              {totalRecords}
            </p>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 shadow-md rounded-lg p-5 w-64 text-center flex items-center">
          <GiReceiveMoney className="text-gray-700 dark:text-gray-50 text-6xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-50">
              Pending total
            </h2>
            <p className="text-xl font-bold text-gray-700 dark:text-gray-50 mt-2">
              {formatCurrencyToLRK(pendingTotal)}
            </p>
          </div>
        </div>
        <div
          className={`${primary_gradient} shadow-md rounded-lg p-5 w-64 text-center flex items-center`}
        >
          <GiTakeMyMoney className="text-gray-50 dark:text-gray-50 text-6xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold text-gray-50 dark:text-gray-50">
              Overdue Total
            </h2>
            <p className="text-xl font-bold text-gray-50 dark:text-gray-50 mt-2">
              {formatCurrencyToLRK(overdueTotal)}
            </p>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 shadow-md rounded-lg p-5 w-64 text-center flex items-center">
          <MdAttachMoney className="text-gray-700 dark:text-gray-50 text-6xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-50">
              Total to receive
            </h2>
            <p className="text-xl font-bold text-gray-700 dark:text-gray-50 mt-2">
              {formatCurrencyToLRK(overdueTotal + pendingTotal)}
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Table hoverable className="w-full table-auto shadow-md">
          <Table.Head>
            <Table.HeadCell>Invoice Number</Table.HeadCell>
            <Table.HeadCell>PO Number</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Received By</Table.HeadCell>
            <Table.HeadCell>Total</Table.HeadCell>
            <Table.HeadCell>Payment Status</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {invoices &&
              invoices.map((invoice) => (
                <Table.Row
                  key={invoice.id}
                  className="bg-white dark:bg-gray-800 dark:border-gray-600"
                >
                  <Table.Cell>{invoice.invoiceNumber}</Table.Cell>
                  <Table.Cell>{invoice.purchaseOrderNumber}</Table.Cell>
                  <Table.Cell>{invoice.date}</Table.Cell>
                  <Table.Cell>{invoice.receiver}</Table.Cell>
                  <Table.Cell>
                    {formatCurrencyToLRK(invoice.totalAmount)}
                  </Table.Cell>
                  <Table.Cell>
                    {invoice.paid ? (
                      <Badge color="green" className="w-16">
                        Paid
                      </Badge>
                    ) : calculateDateDifference(invoice.date) < 30 ? (
                      <Badge color="warning" className="w-16">
                        Pending
                      </Badge>
                    ) : (
                      <Badge color="red" className="w-16">
                        Overdue
                      </Badge>
                    )}
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
    </div>
  );
}
