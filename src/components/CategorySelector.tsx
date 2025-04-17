"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

import { Category } from "@/sanity/types/sanity.types";
import useCategoryStore from "@/store/CategoriesStore";
import { useState } from "react";

type Props = {
  categories: Category[];
};

const CategorySelector = ({ categories }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { category: value, updateCategory } = useCategoryStore();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const selectedCategory = categories.find(
        (category) => category._id === e.currentTarget.value
      );

      if (selectedCategory) {
        handleSelect(selectedCategory._id);
      }
      setOpen(false);
    }
  };

  const handleSelect = (categoryId: string) => {
    updateCategory(categoryId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? categories.find((category) => category._id === value)?.title ||
              "All"
            : "Filter by Category"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search Category..."
            onKeyDown={handleKeyDown}
          />
          <CommandList>
            <CommandEmpty>No Category found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={handleSelect}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === "all" ||
                      !categories.some((category) => category._id === value)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                All
              </CommandItem>
              {categories.map((category) => (
                <CommandItem
                  key={category._id}
                  value={category._id}
                  onSelect={handleSelect}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === category._id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {category.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
export default CategorySelector;
