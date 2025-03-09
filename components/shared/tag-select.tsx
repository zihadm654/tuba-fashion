"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTags } from "@/hooks/use-tags";
import { Button } from "@/components/ui/button";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const DEMO_SUGGESTIONS = [
  { id: "casual-shirt", label: "Casual Shirt" },
  { id: "men-shirt", label: "Men Shirt" },
  { id: "half-sleeve", label: "Half Sleeve" },
  { id: "full-sleeve", label: "Full Sleeve" },
  { id: "pant", label: "Pant" },
];

export function TagsDemo({ form }: any) {
  const [inputValue, setInputValue] = useState("");

  // Get the current value from the form
  const currentTags = form.watch("tags") || [];

  // Initialize useTags with the form's current tags value
  const { tags, addTag, removeTag, removeLastTag, hasReachedMax } = useTags({
    maxTags: 5,
    defaultTags: currentTags,
    onChange: (newTags) => {
      // Update the form value when tags change
      form.setValue(
        "tags",
        newTags.map((tag) => tag.id),
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      );
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !inputValue) {
      e.preventDefault();
      removeLastTag();
    }
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      addTag({ id: inputValue.toLowerCase(), label: inputValue });
      setInputValue("");
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <div className="border-input bg-background rounded-lg border p-1">
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <span
                      key={tag.id}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm",
                        tag.color || "bg-primary/10 text-primary",
                      )}
                    >
                      {tag.label}
                      <button
                        type="button"
                        onClick={() => removeTag(tag.id)}
                        className="rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      hasReachedMax ? "Max tags reached" : "Add tag..."
                    }
                    disabled={hasReachedMax}
                    className="placeholder:text-muted-foreground flex-1 border-0 bg-transparent px-2 py-1 text-sm outline-none disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">Suggestions</label>
        <div className="flex flex-wrap gap-2">
          {DEMO_SUGGESTIONS.map((suggestion) => (
            <Button
              key={suggestion.id}
              variant="outline"
              size="sm"
              type="button"
              onClick={() => {
                if (!tags.find((t) => t.id === suggestion.id)) {
                  addTag(suggestion);
                }
              }}
              disabled={Boolean(
                hasReachedMax || tags.find((t) => t.id === suggestion.id),
              )}
            >
              {suggestion.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
