"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

interface PriceData {
  id: number;
  symbolId: number;
  date: Date;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number;
  volume: number | null;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SymbolPriceTableProps {
  priceData: PriceData[];
}

export default function SymbolPriceTable({ priceData }: SymbolPriceTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>日付</TableHead>
            <TableHead className="text-right">始値</TableHead>
            <TableHead className="text-right">高値</TableHead>
            <TableHead className="text-right">安値</TableHead>
            <TableHead className="text-right">終値</TableHead>
            <TableHead className="text-right">出来高</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {priceData.map((price) => (
            <TableRow key={price.id}>
              <TableCell>{formatDate(price.date)}</TableCell>
              <TableCell className="text-right">{price.open !== null ? price.open.toLocaleString() : '-'}</TableCell>
              <TableCell className="text-right">{price.high !== null ? price.high.toLocaleString() : '-'}</TableCell>
              <TableCell className="text-right">{price.low !== null ? price.low.toLocaleString() : '-'}</TableCell>
              <TableCell className="text-right">{price.close.toLocaleString()}</TableCell>
              <TableCell className="text-right">{price.volume !== null ? price.volume.toLocaleString() : '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 