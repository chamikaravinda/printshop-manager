import { useEffect, useState } from "react";
import { TextInput, Button, Label, Table, Datepicker } from "flowbite-react";
import { format } from "date-fns";
import { primary_button_gradient } from "../../utils/commonConstants";
import { useNavigate, useParams } from "react-router-dom";
import { getDeliveryNote, updateDeliveryNote } from "../../actions/delivery-note.action";

const UpdateDeliveryNote = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    id: "",
    purchaseOrderNumber: "",
    deliveryNoteNumber: "",
    date: "",
    receiver: "",
    items: [],
    orderTotal: 0,
    currentItem: {
      description: "",
      quantity: "",
    },
    editingIndex: null,
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const success = (payload) => {
      setFormData((prevData) => ({
        ...prevData,
        id: payload.id,
        purchaseOrderNumber: payload.purchaseOrderNumber,
        deliveryNoteNumber: payload.deliveryNoteNumber,
        date: payload.date,
        receiver: payload.receiver,
        items: payload.items,
        orderTotal: payload.orderTotal,
      }));
    };
    getDeliveryNote(id, success);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      date: format(date, "dd/MM/yyyy"),
    }));
    setValidationErrors((prevErrors) => ({ ...prevErrors, date: "" }));
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      currentItem: {
        ...prevData.currentItem,
        [name]: value,
      },
    }));
  };

  const handleAddOrUpdateItem = () => {
    if (formData.currentItem.description && formData.currentItem.quantity) {
      setFormData((prevData) => {
        const updatedItems = [...prevData.items];

        if (prevData.editingIndex !== null) {
          updatedItems[prevData.editingIndex] = prevData.currentItem;
        } else {
          updatedItems.push(prevData.currentItem);
        }

        return {
          ...prevData,
          items: updatedItems,
          currentItem: {
            description: "",
            quantity: "",
          },
          editingIndex: null,
        };
      });
    }
  };

  const handleRemoveItem = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      items: prevData.items.filter((_, i) => i !== index),
      editingIndex:
        prevData.editingIndex === index ? null : prevData.editingIndex,
    }));
  };

  const handleEditItem = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      currentItem: { ...prevData.items[index] },
      editingIndex: index,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let errors = {};
    if (!formData.purchaseOrderNumber) errors.purchaseOrderNumber = "Required";
    if (!formData.deliveryNoteNumber) errors.deliveryNoteNumber = "Required";
    if (!formData.date) errors.date = "Required";
    if (!formData.receiver) errors.receiver = "Required";
    if (formData.items.length === 0)
      errors.items = "At least one item must be added";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const newDeliveryNote = {
      purchaseOrderNumber: formData.purchaseOrderNumber,
      deliveryNoteNumber: formData.deliveryNoteNumber,
      date: formData.date,
      receiver: formData.receiver,
      items: formData.items,
      orderTotal: formData.orderTotal,
    };

    const success = () => {
      navigate("/delivery-notes");
    };

    updateDeliveryNote(newDeliveryNote, formData.id, success);
  };

  return (
    <div
      className="p-4 mt-14 flex flex-col bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md justify-self-center self-center"
      style={{ height: "calc(100vh - 180px)", width: "calc(100vw - 500px)" }}
    >
      <h2 className="text-lg font-semibold mb-6">Update Delivery Note</h2>

      <div className="flex space-x-8">
        <div className="w-1/2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="purchaseOrderNumber">Purchase Order Number</Label>
              <TextInput
                id="purchaseOrderNumber"
                name="purchaseOrderNumber"
                placeholder="Enter Purchase Order Number"
                value={formData.purchaseOrderNumber}
                onChange={handleChange}
                className={
                  validationErrors.purchaseOrderNumber ? "border-red-500" : ""
                }
              />
              {validationErrors.purchaseOrderNumber && (
                <p className="text-red-500 text-sm">
                  {validationErrors.purchaseOrderNumber}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="deliveryNoteNumber">Delivery Note Number</Label>
              <TextInput
                id="deliveryNoteNumber"
                name="deliveryNoteNumber"
                placeholder="Enter Delivery Note Number"
                value={formData.deliveryNoteNumber}
                onChange={handleChange}
                className={
                  validationErrors.deliveryNoteNumber ? "border-red-500" : ""
                }
              />
              {validationErrors.deliveryNoteNumber && (
                <p className="text-red-500 text-sm">
                  {validationErrors.deliveryNoteNumber}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Datepicker
                value={formData.date}
                onSelectedDateChanged={handleDateChange}
                format="dd/MM/yyyy"
                className={validationErrors.date ? "border-red-500" : ""}
              />
              {validationErrors.date && (
                <p className="text-red-500 text-sm">{validationErrors.date}</p>
              )}
            </div>
            <div>
              <Label htmlFor="receiver">Ordered By</Label>
              <TextInput
                id="receiver"
                name="receiver"
                placeholder="Enter Customer Name"
                value={formData.receiver}
                onChange={handleChange}
                className={validationErrors.receiver ? "border-red-500" : ""}
              />
              {validationErrors.receiver && (
                <p className="text-red-500 text-sm">
                  {validationErrors.receiver}
                </p>
              )}
            </div>
          </form>
        </div>
        <div className="w-1/2">
          <Label>Add Items</Label>
          <div className="space-y-2">
            <TextInput
              name="description"
              placeholder="Enter Item Description"
              value={formData.currentItem.description}
              onChange={handleItemChange}
            />
            <TextInput
              name="quantity"
              type="number"
              placeholder="Enter Quantity"
              value={formData.currentItem.quantity}
              onChange={handleItemChange}
            />
            <Button
              onClick={handleAddOrUpdateItem}
              className={`${primary_button_gradient} min-w-28 hover:ring-2 hover:ring-pink-900`}
            >
              {formData.editingIndex !== null ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Order Items</h3>
        {validationErrors.items && (
          <p className="text-red-500 text-sm">{validationErrors.items}</p>
        )}
        <div className="min-h-40 max-h-60 overflow-y-auto rounded-lg shadow-md">
          <Table className="w-full">
            <Table.Head>
              <Table.HeadCell className="bg-zinc-200 dark:bg-gray-700">
                Description
              </Table.HeadCell>
              <Table.HeadCell className="bg-zinc-200 dark:bg-gray-700">
                Quantity
              </Table.HeadCell>
              <Table.HeadCell className="bg-zinc-200 dark:bg-gray-700">
                Actions
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="bg-gray-100 dark:bg-gray-800">
              {formData.items.map((item, index) => (
                <Table.Row
                  key={index}
                  onClick={() => handleEditItem(index)}
                  className="cursor-pointer"
                >
                  <Table.Cell>{item.description}</Table.Cell>
                  <Table.Cell>{item.quantity}</Table.Cell>
                  <Table.Cell>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(index);
                      }}
                      className="ml-4 font-medium text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>

      <div className="mt-6 mx-auto flex justify-center">
        <Button
          type="submit"
          onClick={handleSubmit}
          className={`${primary_button_gradient} min-w-28 hover:ring-2 hover:ring-pink-900`}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default UpdateDeliveryNote;
