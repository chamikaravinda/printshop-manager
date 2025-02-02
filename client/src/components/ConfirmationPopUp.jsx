import PropTypes from "prop-types";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { primary_button_gradient } from "../utils/commonConstants";
import { useSelector } from "react-redux";

export default function ConfirmationPopUp(props) {
  const { openModal, message, trueAction, falseAction } = props;
  const { theme } = useSelector((state) => state.theme);
  return (
    <Modal
      show={openModal}
      size="md"
      onClose={() => falseAction()}
      popup
      className={theme}
    >
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-50" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-50">
            {message}
          </h3>
          <div className="flex justify-center gap-4">
            <Button
              className={`${primary_button_gradient} hover:ring-2 hover:ring-pink-900`}
              onClick={() => trueAction()}
            >
              {"Yes, I'm sure"}
            </Button>
            <Button
              color="gray"
              className="hover:ring-2 hover:ring-pink-900"
              onClick={() => falseAction()}
            >
              No, cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

ConfirmationPopUp.propTypes = {
  openModal: PropTypes.bool.isRequired,
  falseAction: PropTypes.func.isRequired,
  trueAction: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};
