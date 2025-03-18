"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  className?: React.HTMLAttributes<HTMLDivElement>;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  disabledDates?: Date[];
  form?: any;
  name?: string;
  label?: string;
  error?: string;
}

export function DatePickerWithRange({
  className,
  date,
  setDate,
  disabledDates = [],
  form,
  name,
  label,
  error,
}: DatePickerProps) {
  const handleSelect = React.useCallback(
    (selectedDate: DateRange | undefined) => {
      if (!selectedDate) {
        setDate(undefined);
        if (form && name) {
          form.setValue(name + "Start", null);
          form.setValue(name + "End", null);
        }
        return;
      }

      const { from, to } = selectedDate;
      if (from && to && from > to) {
        // Prevent invalid date ranges
        return;
      }

      setDate(selectedDate);

      // Update form values directly
      if (form && name) {
        if (from) {
          form.setValue(name + "Start", from);
        } else {
          form.setValue(name + "Start", null);
        }

        if (to) {
          form.setValue(name + "End", to);
        } else {
          form.setValue(name + "End", null);
        }

        // Trigger form validation
        form.trigger([name + "Start", name + "End"]);
      }
    },
    [form, name, setDate],
  );

  return (
    <div className={cn("grid gap-1", className)}>
      {label && (
        <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={error ? "destructive" : "outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              error && "border-red-500",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={disabledDates}
            fromDate={new Date()}
            className="rounded-md border shadow"
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
