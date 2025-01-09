"use client";

import * as React from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { FaCalendar } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerWithRangeProps = {
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
};

export function DatePickerWithRange({
  className,
  date,
  setDate,
}: React.HTMLAttributes<HTMLDivElement> & DatePickerWithRangeProps) {
  const [inDate, setInDate] = React.useState<DateRange | undefined>();

  const onOpenChange = (open: boolean) => {
    if (!open) setDate(inDate);
  };

  React.useEffect(() => {
    setInDate(date);
  }, [date]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal my-2",
              !inDate && "text-muted-foreground"
            )}
          >
            <FaCalendar className="mr-2 h-4 w-4" />
            {inDate?.from ? (
              inDate.to ? (
                <>
                  {format(inDate.from, "LLL dd, y")} -{" "}
                  {format(inDate.to, "LLL dd, y")}
                </>
              ) : (
                format(inDate.from, "LLL dd, y")
              )
            ) : (
              <span>Escolha uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={inDate?.from}
            selected={inDate}
            onSelect={setInDate}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
