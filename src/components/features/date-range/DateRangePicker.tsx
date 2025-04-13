"use client";

import * as React from "react";
import { addDays, format, isAfter, isBefore, isValid, parse } from "date-fns";
import { ja } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface DateRangePickerProps {
  className?: string;
  value: DateRange | undefined;
  onChange: (value: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DateRangePicker({
  className,
  value,
  onChange,
  placeholder = "日付範囲を選択",
  disabled = false,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(value);
  const [startInput, setStartInput] = React.useState<string>(
    value?.from ? format(value.from, "yyyy/MM/dd") : ""
  );
  const [endInput, setEndInput] = React.useState<string>(
    value?.to ? format(value.to, "yyyy/MM/dd") : ""
  );

  // 親コンポーネントから値が変更された場合に対応
  React.useEffect(() => {
    setDateRange(value);
    setStartInput(value?.from ? format(value.from, "yyyy/MM/dd") : "");
    setEndInput(value?.to ? format(value.to, "yyyy/MM/dd") : "");
  }, [value]);

  // 手動入力された日付のハンドリング
  const handleStartInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartInput(value);
    
    try {
      const date = parse(value, "yyyy/MM/dd", new Date());
      if (isValid(date)) {
        const newRange: DateRange = { 
          from: date, 
          to: dateRange?.to 
        };
        
        // 開始日が終了日より後の場合、終了日を開始日と同じに設定
        if (dateRange?.to && isAfter(date, dateRange.to)) {
          newRange.to = date;
          setEndInput(format(date, "yyyy/MM/dd"));
        }
        
        setDateRange(newRange);
        onChange(newRange);
      }
    } catch (error) {
      // 無効な日付形式は無視
    }
  };

  const handleEndInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndInput(value);
    
    try {
      const date = parse(value, "yyyy/MM/dd", new Date());
      if (isValid(date)) {
        const newRange: DateRange = { 
          from: dateRange?.from, 
          to: date 
        };
        
        // 終了日が開始日より前の場合、開始日を終了日と同じに設定
        if (dateRange?.from && isBefore(date, dateRange.from)) {
          newRange.from = date;
          setStartInput(format(date, "yyyy/MM/dd"));
        }
        
        setDateRange(newRange);
        onChange(newRange);
      }
    } catch (error) {
      // 無効な日付形式は無視
    }
  };

  // クイック選択オプション
  const quickSelectOptions = [
    { label: "今日", dates: { from: new Date(), to: new Date() }},
    { label: "昨日", dates: { from: addDays(new Date(), -1), to: addDays(new Date(), -1) }},
    { label: "過去7日間", dates: { from: addDays(new Date(), -6), to: new Date() }},
    { label: "過去30日間", dates: { from: addDays(new Date(), -29), to: new Date() }},
    { label: "過去90日間", dates: { from: addDays(new Date(), -89), to: new Date() }},
  ];

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !dateRange && "text-muted-foreground",
              className
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "yyyy年MM月dd日", { locale: ja })} -{" "}
                  {format(dateRange.to, "yyyy年MM月dd日", { locale: ja })}
                </>
              ) : (
                format(dateRange.from, "yyyy年MM月dd日", { locale: ja })
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    開始日
                  </label>
                  <Input
                    placeholder="YYYY/MM/DD"
                    value={startInput}
                    onChange={handleStartInputChange}
                    className="h-8"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    終了日
                  </label>
                  <Input
                    placeholder="YYYY/MM/DD"
                    value={endInput}
                    onChange={handleEndInputChange}
                    className="h-8"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {quickSelectOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => {
                      setDateRange(option.dates);
                      setStartInput(format(option.dates.from, "yyyy/MM/dd"));
                      setEndInput(format(option.dates.to, "yyyy/MM/dd"));
                      onChange(option.dates);
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={(selectedRange) => {
              setDateRange(selectedRange);
              if (selectedRange?.from) {
                setStartInput(format(selectedRange.from, "yyyy/MM/dd"));
              } else {
                setStartInput("");
              }
              if (selectedRange?.to) {
                setEndInput(format(selectedRange.to, "yyyy/MM/dd"));
              } else {
                setEndInput("");
              }
              onChange(selectedRange);
            }}
            numberOfMonths={2}
            locale={ja}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
} 