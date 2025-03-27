"use client";

import { Brand } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/dashboard/data-table/column-header";

import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<Brand>[] = [
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
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 truncate font-medium">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue("description")}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
