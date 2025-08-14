"use client";

import React from "react";
import dynamic from "next/dynamic";

import {
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import type { Selection, SortDescriptor } from "@heroui/react";

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { Select, SelectItem } from "@heroui/select";
import { Textarea } from "@heroui/input";

// Dynamically import Table with SSR disabled
const Table = dynamic(() => import("@heroui/react").then((mod) => mod.Table), {
  ssr: false,
});

import type { Inventory } from "@/types";
import { useInventoryTable } from "@/hooks/useInventoryTable";
import {
  statusColorMap,
  columns,
  statusOptions,
} from "@/constants/inventoryTable";
import { inventoryItems } from "@/data/inventory";
import {
  PlusIcon,
  SearchIcon,
  ChevronDownIcon,
  VerticalDotsIcon,
} from "@/components/icons";

export default function InventoryTable() {
  // Local state for inventory items to enable dynamic updates
  const [inventoryData, setInventoryData] =
    React.useState<Inventory[]>(inventoryItems);

  // Table state management (replacing useInventoryTable hook)
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set([
      "date",
      "sku",
      "productName",
      "qty",
      "updatedQty",
      "difference",
      "status",
      "staff",
      "actions",
    ])
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "date",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...inventoryData];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.productName.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.sku.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status)
      );
    }

    return filteredUsers;
  }, [inventoryData, filterValue, statusFilter, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Inventory, b: Inventory) => {
      const first = a[sortDescriptor.column as keyof Inventory] as number;
      const second = b[sortDescriptor.column as keyof Inventory] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  // Form state for adding new entries
  const [formData, setFormData] = React.useState({
    sku: "",
    productName: "",
    qty: "",
    updatedQty: "",
    status: "in_stock",
    note: "",
    staff: "",
  });

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddEntry = () => {
    // Validate form data
    if (
      !formData.sku ||
      !formData.productName ||
      !formData.qty ||
      !formData.staff
    ) {
      alert(
        "Please fill in all required fields (SKU, Product Name, Quantity, Staff)"
      );
      return;
    }

    const qty = parseInt(formData.qty);
    const updatedQty = formData.updatedQty
      ? parseInt(formData.updatedQty)
      : qty;

    const newEntry: Inventory = {
      id: inventoryData.length + 1 + Math.floor(Math.random() * 1000), // Ensure unique ID
      date: new Date().toLocaleDateString("en-GB"),
      sku: formData.sku,
      productName: formData.productName,
      qty: qty,
      updatedQty: updatedQty,
      difference: updatedQty - qty,
      status: formData.status,
      note: formData.note || "New entry",
      staff: formData.staff,
    };

    // Add to inventory data state to trigger re-render
    setInventoryData((prevData) => [newEntry, ...prevData]);

    // Reset form
    setFormData({
      sku: "",
      productName: "",
      qty: "",
      updatedQty: "",
      status: "in_stock",
      note: "",
      staff: "",
    });

    alert("Entry added successfully!");
  };

  const renderCell = React.useCallback(
    (item: Inventory, columnKey: React.Key) => {
      const cellValue = item[columnKey as keyof Inventory];

      switch (columnKey) {
        case "date":
          return <div className="text-sm font-medium">{cellValue}</div>;
        case "sku":
          return (
            <div className="font-mono text-sm font-medium text-blue-600">
              {cellValue}
            </div>
          );
        case "productName":
          return (
            <div className="max-w-xs">
              <p className="text-sm font-medium truncate">{cellValue}</p>
            </div>
          );
        case "qty":
        case "updatedQty":
          return (
            <div className="text-sm font-medium text-center">{cellValue}</div>
          );
        case "difference":
          const diff = cellValue as number;
          return (
            <div
              className={`text-sm font-medium text-center ${
                diff > 0
                  ? "text-green-600"
                  : diff < 0
                    ? "text-red-600"
                    : "text-gray-500"
              }`}
            >
              {diff > 0 ? `+${diff}` : diff}
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[item.status]}
              size="sm"
              variant="flat"
            >
              {cellValue === "in_stock"
                ? "In Stock"
                : cellValue === "low_stock"
                  ? "Low Stock"
                  : cellValue === "out_of_stock"
                    ? "Out of Stock"
                    : cellValue === "adjustment"
                      ? "Adjustment"
                      : cellValue}
            </Chip>
          );
        case "staff":
          return (
            <div className="text-sm font-medium text-center">{cellValue}</div>
          );
        case "note":
          return (
            <div className="max-w-xs">
              <p className="text-sm text-gray-600 truncate">{cellValue}</p>
            </div>
          );
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <VerticalDotsIcon className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="view">View Details</DropdownItem>
                  <DropdownItem key="edit">Edit Entry</DropdownItem>
                  <DropdownItem key="adjust">Stock Adjust</DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                  >
                    Delete Entry
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by product name or SKU..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Status Filter"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {status.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {inventoryData.length} inventory entries
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-solid outline-transparent text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    onClear,
    setStatusFilter,
    setVisibleColumns,
    inventoryData.length,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [
    selectedKeys,
    filteredItems.length,
    page,
    pages,
    onPreviousPage,
    onNextPage,
    setPage,
  ]);

  return (
    <div className="flex gap-6">
      {/* Table Section - 3/4 width */}
      <div className="flex-1 w-3/4">
        <Table
          isHeaderSticky
          aria-label="Stock management table with inventory tracking"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={{
            wrapper: "max-h-[500px]",
          }}
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={setSelectedKeys}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={
                  column.uid === "actions"
                    ? "center"
                    : column.uid === "qty" ||
                        column.uid === "updatedQty" ||
                        column.uid === "difference"
                      ? "center"
                      : "start"
                }
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={"No inventory entries found"}
            items={sortedItems}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Entry Form Section - 1/4 width */}
      <div className="w-1/4 min-w-[300px]">
        <div className="bg-content1 rounded-large p-6 shadow-medium sticky top-0">
          <div className="flex items-center gap-2 mb-6">
            <PlusIcon className="text-primary" />
            <h3 className="text-lg font-semibold">Add New Entry</h3>
          </div>

          <div className="space-y-4">
            <Input
              label="SKU"
              placeholder="Enter SKU"
              value={formData.sku}
              onValueChange={(value) => handleFormChange("sku", value)}
              isRequired
              variant="bordered"
              size="sm"
            />

            <Input
              label="Product Name"
              placeholder="Enter product name"
              value={formData.productName}
              onValueChange={(value) => handleFormChange("productName", value)}
              isRequired
              variant="bordered"
              size="sm"
            />

            <Input
              label="Initial Quantity"
              placeholder="Enter quantity"
              type="number"
              value={formData.qty}
              onValueChange={(value) => handleFormChange("qty", value)}
              isRequired
              variant="bordered"
              size="sm"
            />

            <Input
              label="Updated Quantity"
              placeholder="Enter updated quantity"
              type="number"
              value={formData.updatedQty}
              onValueChange={(value) => handleFormChange("updatedQty", value)}
              variant="bordered"
              size="sm"
              description="Leave empty to use initial quantity"
            />

            <Select
              label="Status"
              placeholder="Select status"
              selectedKeys={[formData.status]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                handleFormChange("status", selected);
              }}
              variant="bordered"
              size="sm"
            >
              {statusOptions.map((status) => (
                <SelectItem key={status.uid}>
                  {status.name}
                </SelectItem>
              ))}
            </Select>

            <Input
              label="Staff"
              placeholder="Enter staff name"
              value={formData.staff}
              onValueChange={(value) => handleFormChange("staff", value)}
              isRequired
              variant="bordered"
              size="sm"
            />

            <Textarea
              label="Note"
              placeholder="Enter note (optional)"
              value={formData.note}
              onValueChange={(value) => handleFormChange("note", value)}
              variant="bordered"
              size="sm"
              minRows={2}
              maxRows={3}
            />

            <Button
              color="primary"
              className="w-full"
              onPress={handleAddEntry}
              startContent={<PlusIcon />}
            >
              Add Entry
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
