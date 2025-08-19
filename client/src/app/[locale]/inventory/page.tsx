"use client";

import React, { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import type { Key, SortDescriptor } from "@react-types/shared";
import { Pagination } from "@heroui/pagination";
import { Select, SelectItem } from "@heroui/select";
import { Search } from "lucide-react";

interface Item {
  id: number;
  stateNo: number;
  date: string;
  sku: string;
  name: string;
}

const mockProducts: Item[] = [
  { id: 1, stateNo: 1, date: "16/08/2025", sku: "SKU001", name: "Product A" },
  { id: 2, stateNo: 1, date: "16/08/2025", sku: "SKU002", name: "Product B" },
  { id: 3, stateNo: 2, date: "17/08/2025", sku: "SKU003", name: "Product C" },
  { id: 4, stateNo: 2, date: "17/08/2025", sku: "SKU003", name: "Product C" },
  { id: 5, stateNo: 2, date: "17/08/2025", sku: "SKU003", name: "Product C" },
  { id: 6, stateNo: 2, date: "17/08/2025", sku: "SKU003", name: "Product C" },
  { id: 7, stateNo: 2, date: "17/08/2025", sku: "SKU003", name: "Product C" },
  { id: 8, stateNo: 2, date: "17/08/2025", sku: "SKU003", name: "Product C" },
  { id: 9, stateNo: 2, date: "17/08/2025", sku: "SKU003", name: "Product C" },
  { id: 10, stateNo: 2, date: "17/08/2025", sku: "SKU003", name: "Product C" },
  { id: 11, stateNo: 2, date: "17/08/2025", sku: "SKU003", name: "Product C" },
  { id: 12, stateNo: 2, date: "17/08/2025", sku: "SKU003", name: "Product C" },
  { id: 13, stateNo: 2, date: "17/08/2025", sku: "SKU003", name: "Product C" },
  { id: 14, stateNo: 2, date: "17/08/2025", sku: "SKU003", name: "Product C" },
  { id: 15, stateNo: 2, date: "17/08/2025", sku: "SKU003", name: "Product C" },
];

export default function InventoryManagePage() {
  const [selectedKeys, setSelectedKeys] = useState<Set<Key>>(new Set());
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Item[]>(mockProducts);
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [selectedSearchItems, setSelectedSearchItems] = useState<Set<number>>(
    new Set()
  );
  const [tableSearch, setTableSearch] = useState("");
  const [tablePage, setTablePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "stateNo",
    direction: "ascending",
  });

  const handleSearch = () => {
    const results = mockProducts.filter(
      (item) =>
        item.sku.toLowerCase().includes(search.toLowerCase()) ||
        item.name.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(results);
    setSelectedSearchItems(new Set());
  };

  const handleToggleSelectSearchItem = (id: number) => {
    setSelectedSearchItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleInsertSelected = () => {
    const itemsToAdd = searchResults.filter((item) =>
      selectedSearchItems.has(item.id)
    );
    setItems((prev) => {
      const newItems = [...prev];
      itemsToAdd.forEach((item) => {
        if (!newItems.find((i) => i.id === item.id)) {
          newItems.push(item);
        }
      });
      return newItems;
    });
    setSelectedSearchItems(new Set());
  };

  const handleConfirmList = () => {
    console.log("Confirmed items:", items);
  };

  // Sorting logic
  const sortedItems = [...items].sort((a, b) => {
    const col = sortDescriptor.column as keyof Item;
    let first = a[col];
    let second = b[col];
    if (typeof first === "number" && typeof second === "number") {
      return sortDescriptor.direction === "ascending"
        ? first - second
        : second - first;
    }
    if (typeof first === "string" && typeof second === "string") {
      return sortDescriptor.direction === "ascending"
        ? first.localeCompare(second)
        : second.localeCompare(first);
    }
    return 0;
  });

  // Filtered items for table
  const filteredItems = sortedItems.filter(
    (item) =>
      item.sku.toLowerCase().includes(tableSearch.toLowerCase()) ||
      item.name.toLowerCase().includes(tableSearch.toLowerCase())
  );
  const totalEntries = filteredItems.length;

  // Pagination logic
  const totalPages = Math.ceil(totalEntries / rowsPerPage);
  const paginatedItems = filteredItems.slice(
    (tablePage - 1) * rowsPerPage,
    tablePage * rowsPerPage
  );

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col md:flex-row md:items-end gap-3">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">
            {/* Inventory Check • {storeName} */}
            Inventory Check • test
          </h1>
          <p className="text-sm opacity-70">Daily recounts for all shops</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 w-full md:w-auto">
          <Select
            label="Store"
            // selectedKeys={[storeId]}
            // onSelectionChange={(keys) =>
            //   handleStoreChange(String(Array.from(keys)[0]))
            // }
          >
            {/* {mockStores.map((s) => (
              <SelectItem key={s.id}>{s.name}</SelectItem>
            ))} */}
            <SelectItem>TEST</SelectItem>
          </Select>
          {/* <Input label="Date" value={date} onValueChange={setDate} /> */}
          <Input label="Date" />
          <Input
            startContent={<Search className="w-4 h-4" />}
            label="Search"
            value={search}
            onValueChange={setSearch}
          />
          <Select
            label="Status"
            // selectedKeys={[statusFilter]}
            // onSelectionChange={(keys) =>
            //   setStatusFilter(String(Array.from(keys)[0]))
            // }
          >
            {["All", "Pending", "Updated"].map((k) => (
              <SelectItem key={k}>{k}</SelectItem>
            ))}
          </Select>
        </div>
      </header>

      <div className="flex gap-4">
        {/* Left: Table */}
        <div className="flex-1 border p-4 rounded-lg shadow-sm">
          {/* Top: Table Search */}
          <Input
            placeholder="Search table by SKU or Name"
            value={tableSearch}
            onChange={(e) => {
              setTableSearch(e.target.value);
              setTablePage(1);
            }}
            className="mb-2"
          />
          {/* Total entries message */}
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-600">
              Total {totalEntries} item entries
            </div>
            {/* Row per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm">Rows per page:</span>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setTablePage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <Table
            aria-label="Inventory Table"
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={(keys) => setSelectedKeys(keys as Set<Key>)}
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <TableHeader>
              <TableColumn key="stateNo" allowsSorting>
                State No.
              </TableColumn>
              <TableColumn key="date" allowsSorting>
                Date
              </TableColumn>
              <TableColumn key="sku" allowsSorting>
                SKU
              </TableColumn>
              <TableColumn key="name" allowsSorting>
                Product Name
              </TableColumn>
            </TableHeader>
            <TableBody>
              {paginatedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.stateNo}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Selected count and pagination controls */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-700">
              {selectedKeys.size} of {totalEntries} selected
            </span>
            <div className="flex-1 flex justify-center">
              <Pagination
                page={tablePage}
                total={totalPages}
                onChange={setTablePage}
                size="sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                disabled={tablePage === 1}
                onPress={() => setTablePage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <Button
                size="sm"
                disabled={tablePage === totalPages}
                onPress={() => setTablePage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
          {/* Confirm List button */}
          <Button className="mt-4" color="primary" onPress={handleConfirmList}>
            Confirm List
          </Button>
        </div>

        {/* Right: Search & Add Form */}
        <div className="w-80 border p-4 rounded-lg shadow-sm">
          <Input
            placeholder="Search by SKU or Name"
            isClearable
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            onClear={() => setSearch("")} // Added to clear the search box
          />
          <Button className="mt-2" onPress={handleSearch}>
            Search
          </Button>
          <div className="mt-4">
            {searchResults.map((item) => (
              <div
                key={item.id}
                className={`flex justify-between items-center border-b py-2 ${selectedSearchItems.has(item.id) ? "bg-blue-50" : ""}`}
                onClick={() => handleToggleSelectSearchItem(item.id)}
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.sku}</p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedSearchItems.has(item.id)}
                  onChange={() => handleToggleSelectSearchItem(item.id)}
                />
              </div>
            ))}
          </div>
          {searchResults.length > 0 && (
            <Button
              className="mt-4"
              color="secondary"
              onPress={handleInsertSelected}
            >
              Insert Selected Items
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
