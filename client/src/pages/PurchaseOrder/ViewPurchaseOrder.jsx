import PropTypes from "prop-types";
import { Button, Modal, Table } from "flowbite-react";
import { useSelector } from "react-redux";
import { formatCurrencyToLRK } from "../../utils/commonFuntion";
import { primary_button_gradient, secondary_button_gradient } from "../../utils/commonConstants";
import { useNavigate } from "react-router-dom";

const ViewPurchaseOrder = ({ purchaseOrder, onClose }) => {
  const { theme } = useSelector((state) => state.theme);
  const navigate = useNavigate();

  const updatePurchaseOrder = () => {
    navigate(`/purchase-order/update/${purchaseOrder.id}`);
  };

  return (
    <Modal show={!!purchaseOrder} onClose={onClose} size="xl" className={theme}>
      <Modal.Header className="bg-gray-100 dark:bg-gray-800">
        <div className="flex justify-between w-full">
          <h2 className="text-lg font-semibold">Order Details</h2>
        </div>
      </Modal.Header>
      <Modal.Body className="bg-gray-100 dark:bg-gray-800">
        <div className="space-y-4 dark:text-gray-50">
          <p>
            <span className="font-semibold">Purchase Order Number : </span>
            {purchaseOrder?.purchaseOrderNumber}
          </p>
          <p>
            <span className="font-semibold">Date : </span>
            {purchaseOrder?.date}
          </p>
          <p>
            <span className="font-semibold">Ordered By : </span>
            {purchaseOrder?.orderedBy}
          </p>

          <div className="max-h-60 overflow-y-auto shadow-md">
            <Table className="">
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
                {purchaseOrder?.items.map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{item.description}</Table.Cell>
                    <Table.Cell>{item.quantity}</Table.Cell>
                    <Table.Cell>
                      {formatCurrencyToLRK(item.unitPrice)}
                    </Table.Cell>
                    <Table.Cell>
                      {formatCurrencyToLRK(item.totalPrice)}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
          <p className="text-right mt-4">
            <span className="font-semibold">Total : </span>{" "}
            {formatCurrencyToLRK(purchaseOrder?.orderTotal)}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-gray-100 dark:bg-gray-800">
        <Button
          onClick={updatePurchaseOrder}
          className={`${primary_button_gradient} min-w-28 hover:ring-2 hover:ring-pink-900`}
        >
          Update
        </Button>
        <Button  className={`${secondary_button_gradient} min-w-28 hover:ring-2 hover:ring-pink-900`} onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

ViewPurchaseOrder.propTypes = {
  purchaseOrder: PropTypes.shape({
    id: PropTypes.string,
    purchaseOrderNumber: PropTypes.string,
    date: PropTypes.string,
    orderedBy: PropTypes.string,
    orderTotal: PropTypes.number,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string,
        quantity: PropTypes.number,
        unitPrice: PropTypes.number,
        price: PropTypes.number,
      })
    ),
  }),
  onClose: PropTypes.func.isRequired,
};

export default ViewPurchaseOrder;
