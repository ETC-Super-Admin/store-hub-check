"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Chip } from "@heroui/chip";

const mockStores = [
  { id: "5f9958f59ce4be000634e2ba", name: "Central Warehouse" },
  { id: "5f9958f59ce4be000634e2bb", name: "Downtown Store" },
  { id: "5f9958f59ce4be000634e2bc", name: "Airport Outlet" },
];

interface InventoryItem {
  item: string;
  quantity: number;
  status: string;
}

export default function StoreInventoryPage() {
  const router = useRouter();
  const params = useParams();
  const storeId = params.storeId as string;

  const selectedStore = mockStores.find((store) => store.id === storeId);
  const [items, setItems] = useState<InventoryItem[]>([
    { item: "Sample Product A", quantity: 50, status: "In Stock" },
    { item: "Sample Product B", quantity: 5, status: "Low Stock" },
    { item: "Sample Product C", quantity: 0, status: "Out of Stock" },
  ]);

  const [formData, setFormData] = useState({
    item: "",
    quantity: "",
    status: "",
  });

  const handleSelectStore = (value: string) => {
    router.push(`/inventory/manage/${value}`);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddItem = () => {
    if (formData.item && formData.quantity && formData.status) {
      setItems((prev) => [
        ...prev,
        {
          item: formData.item,
          quantity: Number(formData.quantity),
          status: formData.status,
        },
      ]);
      setFormData({ item: "", quantity: "", status: "" });
    }
  };

  if (!selectedStore) {
    return (
      <div className="p-6">
        <p className="text-red-500">Invalid store ID</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Manage Inventory</h1>
      <p className="text-gray-500">
        Manage inventory for <strong>{selectedStore.name}</strong>.
      </p>

      {/* Store selector */}
      <Select
        label="Select Store"
        selectedKeys={[storeId]}
        onChange={(e) => handleSelectStore(e.target.value)}
      >
        {mockStores.map((store) => (
          <SelectItem key={store.id} data-value={store.id}>
            {store.name}
          </SelectItem>
        ))}
      </Select>

      {/* Two-column layout */}
      <div className="grid grid-cols-4 gap-6 mt-8">
        {/* Inventory Table (3/4 width) */}
        <div className="col-span-3">
          <Card>
            <CardBody>
              <h2 className="text-lg font-semibold mb-4">Inventory List</h2>
              <Table
                aria-label="Inventory table"
                isStriped
                shadow="sm"
                removeWrapper
              >
                <TableHeader>
                  <TableColumn className="w-1/2">ITEM</TableColumn>
                  <TableColumn className="text-center">QUANTITY</TableColumn>
                  <TableColumn className="text-center">STATUS</TableColumn>
                </TableHeader>
                <TableBody>
                  {items.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.item}</TableCell>
                      <TableCell className="text-center font-medium">
                        {row.quantity}
                      </TableCell>
                      <TableCell className="text-center">
                        <Chip
                          size="sm"
                          color={
                            row.status === "In Stock"
                              ? "success"
                              : row.status === "Low Stock"
                                ? "warning"
                                : "danger"
                          }
                          variant="flat"
                        >
                          {row.status}
                        </Chip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </div>

        {/* Add Item Form (1/4 width) */}
        <div className="col-span-1">
          <Card>
            <CardBody>
              <h2 className="text-lg font-semibold mb-4">Add Inventory Item</h2>

              <Input
                label="Item Name"
                placeholder="Enter product name"
                value={formData.item}
                onChange={(e) => handleFormChange("item", e.target.value)}
                className="mb-4"
              />

              <Input
                label="Quantity"
                type="number"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={(e) => handleFormChange("quantity", e.target.value)}
                className="mb-4"
              />

              <Select
                label="Status"
                placeholder="Select status"
                selectedKeys={formData.status ? [formData.status] : []}
                onChange={(e) => handleFormChange("status", e.target.value)}
                className="mb-4"
              >
                <SelectItem key="In Stock" data-value="In Stock">
                  In Stock
                </SelectItem>
                <SelectItem key="Low Stock" data-value="Low Stock">
                  Low Stock
                </SelectItem>
                <SelectItem key="Out of Stock" data-value="Out of Stock">
                  Out of Stock
                </SelectItem>
              </Select>

              <Textarea
                label="Notes"
                placeholder="Optional notes about the product"
                className="mb-4"
              />

              <Button
                color="primary"
                onPress={handleAddItem}
                className="w-full"
              >
                Add Item
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
