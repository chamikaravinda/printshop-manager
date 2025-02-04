import PropTypes from "prop-types";
import { Button, Modal, Table } from "flowbite-react";
import { useSelector } from "react-redux";
import { primary_button_gradient, secondary_button_gradient } from "../../utils/commonConstants";
import { useNavigate } from "react-router-dom";

const ViewDeliveryNote = ({ deliveryNote, onClose }) => {
  const { theme } = useSelector((state) => state.theme);
  const navigate = useNavigate();

  const updateDeliveryNote = () => {
    navigate(`/delivery-note/update/${deliveryNote.id}`);
  };

  return (
    <Modal show={!!deliveryNote} onClose={onClose} size="xl" className={theme}>
      <Modal.Header className="bg-gray-100 dark:bg-gray-800">
        <div className="flex justify-between w-full">
          <h2 className="text-lg font-semibold">Delivery Note Details</h2>
        </div>
      </Modal.Header>
      <Modal.Body className="bg-gray-100 dark:bg-gray-800">
        <div className="space-y-4 dark:text-gray-50">
          <p>
            <span className="font-semibold">Purchase Order Number : </span>
            {deliveryNote?.purchaseOrderNumber}
          </p>
          <p>
            <span className="font-semibold">Delivery Note Number : </span>
            {deliveryNote?.deliveryNoteNumber}
          </p>
          <p>
            <span className="font-semibold">Date : </span>
            {deliveryNote?.date}
          </p>
          <p>
            <span className="font-semibold">Receiver : </span>
            {deliveryNote?.receiver}
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
              </Table.Head>
              <Table.Body className="bg-gray-50 dark:bg-gray-600">
                {deliveryNote?.items.map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{item.description}</Table.Cell>
                    <Table.Cell>{item.quantity}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-gray-100 dark:bg-gray-800">
        <Button
          onClick={updateDeliveryNote}
          className={`${primary_button_gradient} min-w-28 hover:ring-2 hover:ring-pink-900`}
        >
          Update
        </Button>
        <Button  className={`${secondary_button_gradient} min-w-28 hover:ring-2 hover:ring-pink-900`} onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

ViewDeliveryNote.propTypes = {
  deliveryNote: PropTypes.shape({
    id: PropTypes.string,
    purchaseOrderNumber: PropTypes.string,
    deliveryNoteNumber: PropTypes.string,
    date: PropTypes.string,
    receiver: PropTypes.string,
    orderTotal: PropTypes.number,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string,
        quantity: PropTypes.number,
      })
    ),
  }),
  onClose: PropTypes.func.isRequired,
};

export default ViewDeliveryNote;
