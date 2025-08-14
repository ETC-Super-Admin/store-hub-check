"use client";

import { useRouter } from "next/navigation";
import { Select, SelectItem } from "@heroui/select";

const mockStores = [
  { id: "5f9958f59ce4be000634e2ba", name: "Central Warehouse" },
  { id: "5f9958f59ce4be000634e2bb", name: "Downtown Store" },
  { id: "5f9958f59ce4be000634e2bc", name: "Airport Outlet" },
];

export default function ManageInventoryPage() {
  const router = useRouter();

  const handleSelect = (value: string) => {
    router.push(`/inventory/manage/${value}`);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Manage Inventory</h1>
      <p className="text-gray-500">
        Select a store to manage its inventory. For now, data is mocked.
      </p>

      <Select
        label="Select Store"
        placeholder="Choose a store"
        onChange={(e) => handleSelect(e.target.value)}
      >
        {mockStores.map((store) => (
          <SelectItem key={store.id} data-value={store.id}>
            {store.name}
          </SelectItem>
        ))}
      </Select>

      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center text-gray-500">
        No store selected yet.
      </div>
    </div>
  );
}
