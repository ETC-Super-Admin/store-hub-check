"use client";

import React, { useMemo, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { RefreshCw, Filter, Check, RotateCcw, Search } from "lucide-react";
import type { Key } from "@react-types/shared";

// Mock data
const mockStores = [
  { id: "1", name: "Shop 1 - Main" },
  { id: "2", name: "Shop 2 - East" },
  { id: "3", name: "Shop 3 - West" },
];

const mockStaff = [
  { id: "s1", name: "Alice" },
  { id: "s2", name: "Bob" },
  { id: "s3", name: "Charlie" },
];

const mockItems = Array.from({ length: 20 }).map((_, i) => ({
  id: String(i + 1),
  date: "16/08/2025",
  sku: `SKU${1000 + i}`,
  productName: `Product ${i + 1}`,
  qty: 50,
  countedQty: null,
  dif: 0,
  status: "Pending" as "Pending" | "Updated",
  staffId: null,
}));

const mockStafts = [
  { id: "st1", name: "Staft 1" },
  { id: "st2", name: "Staft 1" },
  { id: "st3", name: "Staft 1" },
];

export default function InventoryManagePage() {
  const params = useParams<{ storeId: string }>();
  const pathname = usePathname();
  const router = useRouter();

  const storeId = params.storeId || "1";
  const storeName =
    mockStores.find((s) => s.id === storeId)?.name || "Unknown Store";

  const [date, setDate] = useState("16/08/2025");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedKeys, setSelectedKeys] = useState<Set<Key>>(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalEntries = mockItems.length;

  // Pagination logic
  const pages = Math.ceil(totalEntries / pageSize) || 1;
  const onPreviousPage = () => {
    setPage((p) => Math.max(1, p - 1));
  };
  const onNextPage = () => {
    setPage((p) => Math.min(pages, p + 1));
  };

  // Calculate paginated items
  const paginatedItems = mockItems.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleStoreChange = (nextId: string) => {
    const parts = pathname.split("/");
    parts[parts.length - 1] = nextId;
    router.push(parts.join("/"));
  };

  return (
    <div className="p-4 space-y-4">
      <header className="flex flex-col md:flex-row md:items-end gap-3">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">
            Inventory Check • {storeName}
          </h1>
          <p className="text-sm opacity-70">Daily recounts for all shops</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 w-full md:w-auto">
          <Select
            label="Store"
            selectedKeys={[storeId]}
            onSelectionChange={(keys) =>
              handleStoreChange(String(Array.from(keys)[0]))
            }
          >
            {mockStores.map((s) => (
              <SelectItem key={s.id}>{s.name}</SelectItem>
            ))}
          </Select>
          <Input label="Date" value={date} onValueChange={setDate} />
          <Input
            startContent={<Search className="w-4 h-4" />}
            label="Search"
            value={search}
            onValueChange={setSearch}
          />
          <Select
            label="Status"
            selectedKeys={[statusFilter]}
            onSelectionChange={(keys) =>
              setStatusFilter(String(Array.from(keys)[0]))
            }
          >
            {["All", "Pending", "Updated"].map((k) => (
              <SelectItem key={k}>{k}</SelectItem>
            ))}
          </Select>

        </div>
      </header>

      <Card>
        <CardHeader className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="flat"
              startContent={<RefreshCw className="w-4 h-4" />}
            >
              Refresh
            </Button>
            <Button
              size="sm"
              variant="flat"
              startContent={<Filter className="w-4 h-4" />}
            >
              Reset
            </Button>
            <div className="text-sm text-gray-600">
              Total {totalEntries} item entries
            </div>
          </div>
          <Button color="primary" startContent={<Check className="w-4 h-4" />}>
            Confirm selected
          </Button>
        </CardHeader>
        <CardBody>
          <div className="overflow-auto">
            <Table
              selectionMode="multiple"
              selectedKeys={selectedKeys}
              onSelectionChange={(keys) =>
                setSelectedKeys(new Set(keys as Set<Key>))
              }
            >
              <TableHeader>
                <TableColumn>Date</TableColumn>
                <TableColumn>SKU</TableColumn>
                <TableColumn>Product Name</TableColumn>
                <TableColumn className="text-left">QTY</TableColumn>
                <TableColumn className="text-center">Counted QTY</TableColumn>
                <TableColumn className="text-left">Dif.</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Staff</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody items={paginatedItems} emptyContent="No items found">
                {(row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.sku}</TableCell>
                    <TableCell>{row.productName}</TableCell>
                    <TableCell className="text-left">{row.qty}</TableCell>
                    <TableCell className="flex items-center justify-center">
                      <Input
                        size="sm"
                        className="w-20"
                        value={row.countedQty ?? ""}
                      />
                    </TableCell>
                    <TableCell className="text-left">{row.dif}</TableCell>
                    <TableCell>
                      <Chip>{row.status}</Chip>
                    </TableCell>
                    <TableCell>
                      <Select size="sm" selectedKeys={[row.staffId ?? "none"]}>
                        <SelectItem key="none">—</SelectItem>
                        <>
                          {mockStaff.map((s) => (
                            <SelectItem key={s.id}>{s.name}</SelectItem>
                          ))}
                        </>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="flat"
                        startContent={<Check className="w-4 h-4" />}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        startContent={<RotateCcw className="w-4 h-4" />}
                      >
                        Reset
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardBody>
        <CardFooter className="flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-sm opacity-70">Rows per page</span>
            <select
              className="border rounded px-2 py-1 text-sm w-24"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <Pagination total={pages} page={page} onChange={setPage} />
          <div className="hidden sm:flex w-[30%] justify-end gap-2">
            <Button
              isDisabled={page === 1}
              size="sm"
              variant="flat"
              onPress={onPreviousPage}
            >
              Previous
            </Button>
            <Button
              isDisabled={page === pages}
              size="sm"
              variant="flat"
              onPress={onNextPage}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
