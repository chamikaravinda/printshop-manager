import { useEffect, useState } from "react";
import {
  TextInput,
  Button,
  Label,
  Table,
  Datepicker,
  Badge,
} from "flowbite-react";
import { format } from "date-fns";
import { primary_button_gradient } from "../../utils/commonConstants";
import { formatCurrencyToLRK } from "../../utils/commonFunction";
import { useNavigate, useParams } from "react-router-dom";
import { getInvoice, updateInvoice } from "../../actions/invoices.action";
import { HiOutlineX } from "react-icons/hi";

const UpdateInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    purchaseOrderNumber: "",
    date: "",
    receiver: "",
    items: [],
    totalAmount: 0,
    paid: false,
    deliveryNotes: [],
    currentItem: {
      description: "",
      quantity: "",
      unitPrice: "",
      totalPrice: "",
    },
    currentDeliveryNote: "",
    editingIndex: null,
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const success = (payload) => {
      setFormData((prevData) => ({
        ...prevData,
        id: payload.id,
        invoiceNumber: payload.invoiceNumber,
        purchaseOrderNumber: payload.purchaseOrderNumber,
        date: payload.date,
        receiver: payload.receiver,
        items: payload.items,
        totalAmount: payload.totalAmount,
        deliveryNotes: payload.deliveryNotes,
        paid: payload.paid,
      }));
    };
    getInvoice(id, success);
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
        totalPrice:
          prevData.currentItem.quantity * prevData.currentItem.unitPrice || 0,
      },
    }));
  };

  const handleAddOrUpdateItem = () => {
    if (
      formData.currentItem.description &&
      formData.currentItem.quantity &&
      formData.currentItem.unitPrice
    ) {
      setFormData((prevData) => {
        const updatedItems = [...prevData.items];

        prevData.currentItem.totalPrice =
          prevData.currentItem.quantity * prevData.currentItem.unitPrice;

        if (prevData.editingIndex !== null) {
          updatedItems[prevData.editingIndex] = prevData.currentItem;
        } else {
          updatedItems.push(prevData.currentItem);
        }

        const totalAmount = updatedItems.reduce((total, item) => {
          return total + item.totalPrice;
        }, 0);

        return {
          ...prevData,
          totalAmount,
          items: updatedItems,
          currentItem: {
            description: "",
            quantity: "",
            unitPrice: "",
            totalPrice: "",
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
    if (!formData.invoiceNumber) errors.invoiceNumber = "Required";
    if (!formData.purchaseOrderNumber) errors.purchaseOrderNumber = "Required";
    if (!formData.date) errors.date = "Required";
    if (!formData.receiver) errors.receiver = "Required";
    if (formData.items.length === 0)
      errors.items = "At least one item must be added";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const newInvoice = {
      purchaseOrderNumber: formData.purchaseOrderNumber,
      invoiceNumber: formData.invoiceNumber,
      date: formData.date,
      receiver: formData.receiver,
      items: formData.items,
      totalAmount: formData.totalAmount,
      deliveryNotes: formData.deliveryNotes,
      paid: formData.paid,
    };

    const success = () => {
      navigate("/invoices");
    };

    updateInvoice(newInvoice, formData.id, success);
  };

  const addDeliveryNote = () => {
    setFormData((prevData) => {
      const updatedDeliveryNotes = [
        ...prevData.deliveryNotes,
        prevData.currentDeliveryNote,
      ];
      return {
        ...prevData,
        deliveryNotes: updatedDeliveryNotes,
        currentDeliveryNote: "",
      };
    });
  };

  const removeDeliveryNote = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      deliveryNotes: prevData.deliveryNotes.filter((_, i) => i !== index),
    }));
  };

  return (
    <div
      className="p-4 mt-14 flex flex-col bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md justify-self-center self-center"
      style={{ height: "calc(100vh - 180px)", width: "calc(100vw - 500px)" }}
    >
      <h2 className="text-lg font-semibold mb-4">Update Invoice</h2>

      <div className="flex space-x-8">
        <div className="w-1/2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <TextInput
                id="invoiceNumber"
                name="invoiceNumber"
                placeholder="Enter Invoice Number"
                value={formData.invoiceNumber}
                onChange={handleChange}
                className={
                  validationErrors.invoiceNumber ? "border-red-500" : ""
                }
              />
              {validationErrors.invoiceNumber && (
                <p className="text-red-500 text-sm">
                  {validationErrors.invoiceNumber}
                </p>
              )}
            </div>
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
              <Label htmlFor="receiver">Received By</Label>
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
            <div>
              <label
                htmlFor="paid"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Payment Status
              </label>
              <select
                id="paid"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-700 
                dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 
                dark:focus:border-cyan-500"
                name="paid"
                value={formData.paid}
                onChange={handleChange}
              >
                <option
                  selected={formData.paid}
                  value={true}
                  className="focus:bg-gray-700 dark:focus:bg-gray-700"
                >
                  Paid
                </option>
                <option selected={formData.paid} value={false}>
                  Not Paid
                </option>
              </select>
            </div>
          </form>
        </div>
        <div className="w-1/2">
          <Label>Add Delivery notes</Label>
          <div className="flex flex-auto pb-1 justify-between">
            <TextInput
              id="currentDeliveryNote"
              name="currentDeliveryNote"
              placeholder="Enter Delivery Note Number"
              value={formData.currentDeliveryNote}
              onChange={handleChange}
              className="w-3/4"
            />
            <Button
              onClick={addDeliveryNote}
              className={`${primary_button_gradient} min-w-28 hover:ring-2 hover:ring-pink-900`}
            >
              {formData.editingIndex !== null ? "Update" : "Add"}
            </Button>
          </div>
          <div className="flex flex-row pb-4">
            {formData.deliveryNotes.length > 0 &&
              formData.deliveryNotes.map((note, index) => {
                return (
                  <Badge
                    icon={HiOutlineX}
                    className="bg-slate-500 text-white m-w-12 m-1"
                    key={index}
                    onClick={() => removeDeliveryNote(index)}
                  >
                    {note}
                  </Badge>
                );
              })}
          </div>
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
            <TextInput
              name="unitPrice"
              type="number"
              placeholder="Enter Unit Price"
              value={formData.currentItem.unitPrice}
              onChange={handleItemChange}
            />
            <TextInput
              name="totalPrice"
              type="number"
              placeholder="Total Price"
              value={
                formData.currentItem.quantity *
                  formData.currentItem.unitPrice || 0
              }
              readOnly
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
        <h3 className="text-lg font-semibold mb-2">Invoice Items</h3>
        {validationErrors.items && (
          <p className="text-red-500 text-sm">{validationErrors.items}</p>
        )}
        <div className="min-h-44 max-h-60 overflow-y-auto rounded-lg shadow-md">
          <Table className="w-full">
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
                Total Price
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
                  <Table.Cell>{formatCurrencyToLRK(item.unitPrice)}</Table.Cell>
                  <Table.Cell>
                    {formatCurrencyToLRK(item.totalPrice)}
                  </Table.Cell>
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
        <p className="text-right mt-4">
          <span className="font-semibold">Total : </span>{" "}
          {formatCurrencyToLRK(formData.totalAmount)}
        </p>
      </div>

      <div className="mx-auto flex justify-center">
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

export default UpdateInvoice;
