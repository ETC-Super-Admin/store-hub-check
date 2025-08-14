import { SVGProps } from "react";
import type { ChipProps } from "@heroui/react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Inventory {
  id: number;
  date: string;
  sku: string;
  productName: string;
  qty: number;
  updatedQty: number;
  difference: number;
  status: string;
  note: string;
  staff: string;
}

export interface Column {
  name: string;
  uid: string;
  sortable?: boolean;
}

export interface StatusOption {
  name: string;
  uid: string;
}

export type StatusColorMap = Record<string, ChipProps["color"]>;