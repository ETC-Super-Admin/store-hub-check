import type { Column, StatusOption, StatusColorMap } from "@/types";

export const columns: Column[] = [
    { name: "DATE", uid: "date", sortable: true },
    { name: "SKU", uid: "sku", sortable: true },
    { name: "PRODUCT NAME", uid: "productName", sortable: true },
    { name: "QTY", uid: "qty", sortable: true },
    { name: "UPDATED QTY", uid: "updatedQty", sortable: true },
    { name: "DIF.", uid: "difference", sortable: true },
    { name: "STATUS", uid: "status", sortable: true },
    { name: "STAFF", uid: "staff", sortable: true },
    { name: "NOTE", uid: "note" },
    { name: "ACTION", uid: "actions" },
];

export const statusOptions: StatusOption[] = [
    { name: "In Stock", uid: "in_stock" },
    { name: "Low Stock", uid: "low_stock" },
    { name: "Out of Stock", uid: "out_of_stock" },
    { name: "Adjustment", uid: "adjustment" },
];

export const statusColorMap: StatusColorMap = {
    in_stock: "success",
    low_stock: "warning",
    out_of_stock: "danger",
    adjustment: "primary",
};

export const INITIAL_VISIBLE_COLUMNS = ["date", "sku", "productName", "qty", "updatedQty", "difference", "status", "staff", "actions"];