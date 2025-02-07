import PropTypes from "prop-types";
import { Button, Modal, Table, Badge } from "flowbite-react";
import { useSelector } from "react-redux";
import { formatCurrencyToLRK } from "../../utils/commonFunction";
import {
  primary_button_gradient,
  secondary_button_gradient,
} from "../../utils/commonConstants";
import { useNavigate } from "react-router-dom";

const ViewInvoice = ({ invoice, onClose }) => {
  const { theme } = useSelector((state) => state.theme);
  const navigate = useNavigate();

  const updateInvoice = () => {
    navigate(`/invoice/update/${invoice.id}`);
  };

  return (
    <Modal show={!!invoice} onClose={onClose} size="xl" className={theme}>
      <Modal.Header className="bg-gray-100 dark:bg-gray-800">
        <div className="flex justify-between w-full">
          <h2 className="text-lg font-semibold">Invoice Details</h2>
        </div>
      </Modal.Header>
      <Modal.Body className="bg-gray-100 dark:bg-gray-800">
        <div className="grid grid-cols-2 gap-4 dark:text-gray-50">
          <p>
            <span className="font-semibold">Invoice Number : </span>
            {invoice?.invoiceNumber}
          </p>
          <p>
            <span className="font-semibold">Purchase Order Number : </span>
            {invoice?.purchaseOrderNumber}
          </p>
          <p>
            <span className="font-semibold">Date : </span>
            {invoice?.date}
          </p>
          <p>
            <span className="font-semibold">Received By : </span>
            {invoice?.receiver}
          </p>
          <p>
            <span className="font-semibold">Delivery Notes : </span>
            {invoice?.deliveryNotes?.join(", ") || "N/A"}
          </p>
          <p className="flex items-center">
            <span className="font-semibold mr-2">Payment Status : </span>
            <Badge color={invoice?.paid ? "green" : "red"}>
              {invoice?.paid ? "Paid" : "Pending"}
            </Badge>
          </p>
        </div>

        <div className="max-h-60 overflow-y-auto shadow-md mt-4">
          <Table>
            <Table.Head>
              <Table.HeadCell className="bg-zinc-200 dark:bg-gray-700">
                Description
              </Table.HeadCell>
              <Table.HeadCell className="bg-zinc-200 dark:bg-gray-700">
                Quantity
              </Table.HeadCell>
              <Table.HeadCell className="bg-zinc-200 dark:bg-gray-700">
                Unit Price
              </Table.HeadCell>
              <Table.HeadCell className="bg-zinc-200 dark:bg-gray-700">
                Price
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="bg-gray-50 dark:bg-gray-600">
              {invoice?.items.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{item.description}</Table.Cell>
                  <Table.Cell>{item.quantity}</Table.Cell>
                  <Table.Cell>{formatCurrencyToLRK(item.unitPrice)}</Table.Cell>
                  <Table.Cell>{formatCurrencyToLRK(item.totalPrice)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <p className="text-right mt-4">
          <span className="font-semibold">Total : </span>
          {formatCurrencyToLRK(invoice?.totalAmount)}
        </p>
      </Modal.Body>
      <Modal.Footer className="bg-gray-100 dark:bg-gray-800">
        <Button
          onClick={updateInvoice}
          className={`${primary_button_gradient} min-w-28 hover:ring-2 hover:ring-pink-900`}
        >
          Update
        </Button>
        <Button
          className={`${secondary_button_gradient} min-w-28 hover:ring-2 hover:ring-pink-900`}
          onClick={onClose}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ViewInvoice.propTypes = {
  invoice: PropTypes.shape({
    id: PropTypes.string,
    purchaseOrderNumber: PropTypes.string,
    invoiceNumber: PropTypes.string,
    date: PropTypes.string,
    receiver: PropTypes.string,
    totalAmount: PropTypes.number,
    paid: PropTypes.bool,
    deliveryNotes: PropTypes.arrayOf(PropTypes.number),
    items: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string,
        quantity: PropTypes.number,
        unitPrice: PropTypes.number,
        totalPrice: PropTypes.number,
      })
    ),
  }),
  onClose: PropTypes.func.isRequired,
};

export default ViewInvoice;
