import { useEffect, useState } from "react";
import { TextInput, Button, Label, Table, Datepicker } from "flowbite-react";
import { format } from "date-fns";
import { primary_button_gradient } from "../../utils/commonConstants";
import { formatCurrencyToLRK } from "../../utils/commonFunction";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPurchaseOrder,
  updatePurchaseOrders,
} from "../../actions/purchase-order.action";

const UpdatePurchaseOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    id: "",
    purchaseOrderNumber: "",
    date: "",
    orderedBy: "",
    items: [],
    orderTotal: 0,
    currentItem: {
      description: "",
      quantity: "",
      unitPrice: "",
      totalPrice: "",
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
        date: payload.date,
        orderedBy: payload.orderedBy,
        items: payload.items,
        orderTotal: payload.orderTotal,
      }));
    };
    getPurchaseOrder(id, success);
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

        const orderTotal = updatedItems.reduce((total, item) => {
          return total + item.totalPrice;
        }, 0);

        return {
          ...prevData,
          orderTotal,
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
    if (!formData.purchaseOrderNumber) errors.purchaseOrderNumber = "Required";
    if (!formData.date) errors.date = "Required";
    if (!formData.orderedBy) errors.orderedBy = "Required";
    if (formData.items.length === 0)
      errors.items = "At least one item must be added";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const newPurchaseOrder = {
      purchaseOrderNumber: formData.purchaseOrderNumber,
      date: formData.date,
      orderedBy: formData.orderedBy,
      items: formData.items,
      orderTotal: formData.orderTotal,
    };

    const success = () => {
      navigate("/purchase-orders");
    };

    updatePurchaseOrders(newPurchaseOrder, formData.id, success);
  };

  return (
    <div
      className="p-4 mt-14 flex flex-col bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md justify-self-center self-center"
      style={{ height: "calc(100vh - 180px)", width: "calc(100vw - 500px)" }}
    >
      <h2 className="text-lg font-semibold mb-6">Update Purchase Order</h2>

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
              <Label htmlFor="orderedBy">Ordered By</Label>
              <TextInput
                id="orderedBy"
                name="orderedBy"
                placeholder="Enter Customer Name"
                value={formData.orderedBy}
                onChange={handleChange}
                className={validationErrors.orderedBy ? "border-red-500" : ""}
              />
              {validationErrors.orderedBy && (
                <p className="text-red-500 text-sm">
                  {validationErrors.orderedBy}
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
          {formatCurrencyToLRK(formData.orderTotal)}
        </p>
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

export default UpdatePurchaseOrder;
