import { useState } from "react";
import PropTypes from "prop-types";
import { TextInput, Button, Label, Table, Datepicker } from "flowbite-react";
import { format } from "date-fns";

const AddPurchaseOrder = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    purchaseOrderNumber: "",
    date: "",
    receiver: "",
    items: [],
    currentItem: { description: "", quantity: "", unitPrice: "", totalPrice: "" },
    editingIndex: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({ ...prevData, date: format(date, "dd/MM/yyyy") }));
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      currentItem: {
        ...prevData.currentItem,
        [name]: value,
        totalPrice: (prevData.currentItem.quantity * prevData.currentItem.unitPrice) || 0,
      },
    }));
  };

  const handleAddOrUpdateItem = () => {
    if (formData.currentItem.description && formData.currentItem.quantity && formData.currentItem.unitPrice) {
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
          currentItem: { description: "", quantity: "", unitPrice: "", totalPrice: "" },
          editingIndex: null,
        };
      });
    }
  };

  const handleRemoveItem = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      items: prevData.items.filter((_, i) => i !== index),
      editingIndex: prevData.editingIndex === index ? null : prevData.editingIndex,
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
    onSubmit(formData);
    setFormData({ purchaseOrderNumber: "", date: "", receiver: "", items: [], currentItem: { description: "", quantity: "", unitPrice: "", totalPrice: "" }, editingIndex: null });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full h-full flex flex-col">
      <div className="flex-grow flex">
        <div className="w-1/2 pr-4">
          <h2 className="text-lg font-semibold mb-4">Add Purchase Order</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="purchaseOrderNumber">Purchase Order Number</Label>
              <TextInput
                id="purchaseOrderNumber"
                name="purchaseOrderNumber"
                placeholder="Enter Purchase Order Number"
                value={formData.purchaseOrderNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Datepicker
                value={formData.date}
                onSelectedDateChanged={handleDateChange}
                required
                format="dd/MM/yyyy"
              />
            </div>
            <div>
              <Label htmlFor="receiver">Receiver</Label>
              <TextInput
                id="receiver"
                name="receiver"
                placeholder="Enter Receiver Name"
                value={formData.receiver}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Add Item</Label>
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
                  value={formData.currentItem.quantity * formData.currentItem.unitPrice || 0}
                  readOnly
                />
                <Button onClick={handleAddOrUpdateItem} className="ml-2">
                  {formData.editingIndex !== null ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          </form>
        </div>
        <div className="w-1/2 pl-4 border-l overflow-auto">
          <h3 className="text-lg font-semibold mb-4">Added Items</h3>
          <Table className="w-full">
            <Table.Head>
              <Table.HeadCell>Description</Table.HeadCell>
              <Table.HeadCell>Quantity</Table.HeadCell>
              <Table.HeadCell>Unit Price</Table.HeadCell>
              <Table.HeadCell>Total Price</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {formData.items.map((item, index) => (
                <Table.Row key={index} onClick={() => handleEditItem(index)} className="cursor-pointer">
                  <Table.Cell>{item.description}</Table.Cell>
                  <Table.Cell>{item.quantity}</Table.Cell>
                  <Table.Cell>{item.unitPrice}</Table.Cell>
                  <Table.Cell>{item.totalPrice}</Table.Cell>
                  <Table.Cell>
                    <Button color="failure" onClick={(e) => { e.stopPropagation(); handleRemoveItem(index); }}>Remove</Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button type="submit" className="bg-blue-500 text-white">Submit</Button>
      </div>
    </div>
  );
};

AddPurchaseOrder.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default AddPurchaseOrder;
