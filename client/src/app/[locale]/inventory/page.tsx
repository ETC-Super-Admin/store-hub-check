"use client";

import React, { useState, useMemo } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,

} from "@heroui/table";

import {
    Input,
    Button,
    Card,
    CardBody,
    CardHeader,
    Select,
    SelectItem,
    Divider
} from "@heroui/react";

import { Search, Plus } from "lucide-react";

interface InventoryItem {
    id: number;
    date: string;
    sku: string;
    name: string;
    qty: number;
    updated_qty: number;
}

export default function InventoryPage() {
    // Sample data - replace with your actual data source
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
        {
            id: 1,
            date: "2024-08-13",
            sku: "SKU001",
            name: "Product A",
            qty: 100,
            updated_qty: 95
        },
        {
            id: 2,
            date: "2024-08-12",
            sku: "SKU002",
            name: "Product B",
            qty: 50,
            updated_qty: 48
        }
    ]);

    // Form state
    const [selectedStore, setSelectedStore] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        sku: "",
        name: "",
        qty: "",
        updated_qty: ""
    });

    // Stores data
    const stores = [
        { key: "store1", label: "Store 1" },
        { key: "store2", label: "Store 2" },
        { key: "store3", label: "Store 3" }
    ];

    // Filter items based on search
    const filteredItems = useMemo(() => {
        return inventoryItems.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [inventoryItems, searchTerm]);

    // Handle form submission
    const handleSubmit = () => {
        if (formData.sku && formData.name && formData.qty && formData.updated_qty) {
            const newItem: InventoryItem = {
                id: inventoryItems.length + 1,
                date: new Date().toISOString().split('T')[0],
                sku: formData.sku,
                name: formData.name,
                qty: parseInt(formData.qty),
                updated_qty: parseInt(formData.updated_qty)
            };

            setInventoryItems([...inventoryItems, newItem]);

            // Reset form
            setFormData({
                sku: "",
                name: "",
                qty: "",
                updated_qty: ""
            });
        }
    };

    // Handle form reset
    const handleCancel = () => {
        setFormData({
            sku: "",
            name: "",
            qty: "",
            updated_qty: ""
        });
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full">
            {/* Store Selection */}
            <div className="w-full mb-4">
                <Select
                    label="Select Store"
                    placeholder="Choose a store"
                    selectedKeys={selectedStore ? [selectedStore] : []}
                    onSelectionChange={(keys) => setSelectedStore(Array.from(keys)[0] as string)}
                    className="max-w-xs"
                >
                    {stores.map((store) => (
                        <SelectItem key={store.key}>
                            {store.label}
                        </SelectItem>
                    ))}
                </Select>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1">
                {/* Left Side - Inventory Table */}
                <div className="flex-1">
                    <Card className="h-full">
                        <CardHeader className="flex gap-3">
                            <div className="flex flex-col flex-1">
                                <p className="text-lg font-semibold">Inventory Items</p>
                                <p className="text-small text-default-500">Manage your stock inventory</p>
                            </div>
                            <Input
                                className="max-w-xs"
                                placeholder="Search products..."
                                startContent={<Search className="w-4 h-4" />}
                                value={searchTerm}
                                onValueChange={setSearchTerm}
                            />
                        </CardHeader>
                        <CardBody>
                            <Table
                                aria-label="Inventory table"
                                className="min-h-[400px]"
                                removeWrapper
                            >
                                <TableHeader>
                                    <TableColumn>NO</TableColumn>
                                    <TableColumn>DATE</TableColumn>
                                    <TableColumn>SKU</TableColumn>
                                    <TableColumn>NAME</TableColumn>
                                    <TableColumn>QTY</TableColumn>
                                    <TableColumn>UPDATED QTY</TableColumn>
                                </TableHeader>
                                <TableBody emptyContent="No inventory items found">
                                    {filteredItems.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.date}</TableCell>
                                            <TableCell>{item.sku}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.qty}</TableCell>
                                            <TableCell>{item.updated_qty}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardBody>
                    </Card>
                </div>

                {/* Right Side - Add Product Form */}
                <div className="lg:w-80">
                    <Card className="h-full">
                        <CardHeader>
                            <div className="flex flex-col">
                                <p className="text-lg font-semibold">Add Product</p>
                                <p className="text-small text-default-500">Add new inventory item</p>
                            </div>
                        </CardHeader>
                        <Divider />
                        <CardBody className="gap-4">
                            <Input
                                label="SKU"
                                placeholder="Enter product SKU"
                                value={formData.sku}
                                onValueChange={(value) => setFormData({ ...formData, sku: value })}
                            />

                            <Input
                                label="Product Name"
                                placeholder="Enter product name"
                                value={formData.name}
                                onValueChange={(value) => setFormData({ ...formData, name: value })}
                            />

                            <Input
                                label="Quantity"
                                placeholder="Enter quantity"
                                type="number"
                                value={formData.qty}
                                onValueChange={(value) => setFormData({ ...formData, qty: value })}
                            />

                            <Input
                                label="Updated Quantity"
                                placeholder="Enter updated quantity"
                                type="number"
                                value={formData.updated_qty}
                                onValueChange={(value) => setFormData({ ...formData, updated_qty: value })}
                            />

                            <div className="flex gap-2 mt-4">
                                <Button
                                    variant="light"
                                    onPress={handleCancel}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={handleSubmit}
                                    startContent={<Plus className="w-4 h-4" />}
                                    className="flex-1"
                                >
                                    Insert
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}