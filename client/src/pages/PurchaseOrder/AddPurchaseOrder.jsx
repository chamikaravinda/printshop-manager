import { useState } from "react";
import { TextInput, Button, Label, Table, Datepicker } from "flowbite-react";
import { format } from "date-fns";

const AddPurchaseOrder = () => {
  const [formData, setFormData] = useState({
    purchaseOrderNumber: "",
    date: "",
    receiver: "",
    items: [],
    currentItem: {
      description: "",
      quantity: "",
      unitPrice: "",
      totalPrice: "",
    },
    editingIndex: null,
  });

  const [validationErrors, setValidationErrors] = useState({});

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
    if (!formData.receiver) errors.receiver = "Required";
    if (formData.items.length === 0)
      errors.items = "At least one item must be added";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    console.log("Purchase Order Submitted:", formData);

    setFormData({
      purchaseOrderNumber: "",
      date: "",
      receiver: "",
      items: [],
      currentItem: {
        description: "",
        quantity: "",
        unitPrice: "",
        totalPrice: "",
      },
      editingIndex: null,
    });

    setValidationErrors({});
  };

  return (
    <div
      className="p-4 m-4 flex flex-col bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md"
      style={{ height: "calc(100vh - 90px)", width: "calc(100vw - 270px)" }}
    >
      <h2 className="text-lg font-semibold mb-6">Create Purchase Order</h2>

      {/* Left (Purchase Order Fields) and Right (Add Items Fields) */}
      <div className="flex space-x-8">
        {/* Left Section */}
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
              <Label htmlFor="receiver">Receiver</Label>
              <TextInput
                id="receiver"
                name="receiver"
                placeholder="Enter Receiver Name"
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

        {/* Right Section - Add Items */}
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
            <Button onClick={handleAddOrUpdateItem} className="object-center">
              {formData.editingIndex !== null ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </div>

      {/* Table for Added Items (Scrollable with Minimum Height) */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Order Items</h3>
        {validationErrors.items && (
          <p className="text-red-500 text-sm">{validationErrors.items}</p>
        )}
        <div className="min-h-40 max-h-60 overflow-y-auto border rounded-lg shadow-md">
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
            <Table.Body className="bg-gray-50 dark:bg-gray-600">
              {formData.items.map((item, index) => (
                <Table.Row
                  key={index}
                  onClick={() => handleEditItem(index)}
                  className="cursor-pointer"
                >
                  <Table.Cell>{item.description}</Table.Cell>
                  <Table.Cell>{item.quantity}</Table.Cell>
                  <Table.Cell>{item.unitPrice}</Table.Cell>
                  <Table.Cell>{item.totalPrice}</Table.Cell>
                  <Table.Cell>
                    <Button
                      color="failure"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(index);
                      }}
                    >
                      Remove
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>

      {/* Submit Button (Centered) */}
      <div className="mt-6 mx-auto flex justify-center">
        <Button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default AddPurchaseOrder;
