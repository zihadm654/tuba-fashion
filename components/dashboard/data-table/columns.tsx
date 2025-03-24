"use client";

import { Product } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { DataTableColumnHeader } from "./column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="id" />
    ),
    cell: ({ row }) => (
      <div className="max-w-48 truncate font-medium capitalize">
        {row.getValue("id")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 truncate font-medium">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="description" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 truncate font-medium">
          <span className="max-w-48 truncate font-medium capitalize">
            {row.getValue("description")}
          </span>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "category",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Category" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex max-w-[500px] space-x-2">
  //         <span className="truncate font-medium capitalize">
  //           {row.getValue("category")}
  //         </span>
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "images",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Images" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex max-w-48 space-x-2 truncate font-medium">
          <span className="truncate font-medium capitalize">
            {row.getValue("images")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize"> {row.getValue("status")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("price");
      return (
        <div className="flex w-[100px] items-center">
          <span
            className={cn(
              "capitalize",
              type === "price" ? "text-green-500" : "text-red-500",
            )}
          >
            {" "}
            {row.getValue("price")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="created Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formattedDate = date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize">{formattedDate}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowDate = new Date(row.getValue(id));
      const [startDate, endDate] = value;
      return rowDate >= startDate && rowDate <= endDate;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
