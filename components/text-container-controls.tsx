// components/text-container-controls.tsx

"use client";

import { useEffect, useState } from "react"; // Import useState
import { Check, ChevronsUpDown, Trash2 } from "lucide-react"; // Import icons

import { cn } from "@/lib/utils"; // Import cn utility
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"; // Import Command components
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Import Popover components

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, // Keep Select for Font Weight
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TextContainer } from "@/types/text-style-config";
import { fontOptions, fontWeightOptions } from "@/lib/options"; // Assuming fontOptions has { label: string, value: string }
import { Card, CardContent } from "@/components/ui/card";
import SliderWithInput from "./slider-with-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ColorPickerWithInput from "./color-picker-with-input";
import { Textarea } from "./ui/textarea";

// --- Helper Function to Load Google Fonts (remains the same) ---
function loadGoogleFont(fontFamily: string, weight: string | number) {
  if (!fontFamily || !weight) {
    console.warn("Missing font family or weight for loading.");
    return;
  }
  const familyForUrl = fontFamily.replace(/ /g, "+");
  const numericWeight =
    typeof weight === "string" ? parseInt(weight, 10) : weight;
  const fontId = `google-font-${familyForUrl}-${numericWeight}-normal`;

  if (document.getElementById(fontId)) {
    return;
  }

  let apiUrl = `https://fonts.googleapis.com/css2?family=${familyForUrl}`;
  apiUrl += `:wght@${numericWeight}`;
  apiUrl += "&display=swap";
  console.log(`Requesting Google Font: ${apiUrl}`);

  const link = document.createElement("link");
  link.id = fontId;
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = apiUrl;
  document.head.appendChild(link);
}
// --- End Helper Function ---

interface TextContainerControlsProps {
  container: TextContainer;
  updateTextContainer: (
    id: string,
    updates: Partial<Omit<TextContainer, "id">>,
  ) => void;
  removeTextContainer: (id: string) => void;
  canRemove: boolean;
}

export default function TextContainerControls({
  container,
  updateTextContainer,
  removeTextContainer,
  canRemove,
}: TextContainerControlsProps) {
  // State for controlling the Popover's visibility
  const [fontPopoverOpen, setFontPopoverOpen] = useState(false);

  // --- Optional: Load initial font on mount (remains the same) ---
  useEffect(() => {
    if (container.fontFamily && container.fontWeight) {
      loadGoogleFont(container.fontFamily, container.fontWeight);
    }
  }, [container.id]);
  // --- End Optional Initial Load ---

  const handleUpdate = (updates: Partial<Omit<TextContainer, "id">>) => {
    updateTextContainer(container.id, updates);
  };

  // This function is now called from the CommandItem's onSelect
  const handleFontFamilyChange = (newFontFamily: string) => {
    // Check if it's actually a new font before loading/updating
    if (newFontFamily && newFontFamily !== container.fontFamily) {
      // 1. Load the new font family (using the current weight)
      loadGoogleFont(newFontFamily, container.fontWeight);
      // 2. Update the state
      handleUpdate({ fontFamily: newFontFamily });
    }
  };

  // Handler for Font Weight (remains the same)
  const handleFontWeightChange = (newFontWeight: string) => {
    if (newFontWeight && newFontWeight !== container.fontWeight.toString()) {
      loadGoogleFont(container.fontFamily, newFontWeight);
      handleUpdate({ fontWeight: newFontWeight });
    }
  };

  // Find the label for the currently selected font to display on the button
  const selectedFontLabel =
    fontOptions.find((font) => font.value === container.fontFamily)?.label ||
    "Select font...";

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        {/* ... (Top part with Title and Remove Button remains the same) ... */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Text Container</h3>
          {canRemove && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeTextContainer(container.id)}
              className="h-8 w-8 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {/* {text input thingy} */}
          <div className="space-y-2">
            <Label htmlFor={`text-content-${container.id}`}>Text Content</Label>
            <Textarea
              id={`text-content-${container.id}`}
              value={container.text}
              onChange={(e) => handleUpdate({ text: e.target.value })}
            />
          </div>
          {/* {text input thingy end} */}

          <div className="flex w-full gap-2 flex-col md:flex-row">
            {/* --- Font Family Command Popover --- */}
            <div className="space-y-2 flex-grow basis-1/2">
              <Label>Font Family</Label>
              <Popover open={fontPopoverOpen} onOpenChange={setFontPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={fontPopoverOpen}
                    className="w-full justify-between font-normal" // Use font-normal so button text doesn't change font
                  >
                    {selectedFontLabel}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  {/* Use trigger width */}
                  <Command>
                    <CommandInput placeholder="Search font..." />
                    <CommandList>
                      <CommandEmpty>No font found.</CommandEmpty>
                      <CommandGroup>
                        {fontOptions.map((font) => (
                          <CommandItem
                            key={font.value}
                            value={font.value} // Value used for searching/matching
                            onSelect={(currentValue) => {
                              // currentValue is the 'value' of the selected item
                              handleFontFamilyChange(currentValue);
                              setFontPopoverOpen(false); // Close popover on select
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                container.fontFamily === font.value
                                  ? "opacity-100"
                                  : "opacity-0", // Show check only if selected
                              )}
                            />
                            {font.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {/* command thingy end  */}

            {/* --- Font Weight Select */}
            <div className="space-y-2 flex-grow basis-1/2">
              <Label htmlFor={`font-weight-${container.id}`}>Font Weight</Label>
              <Select
                value={container.fontWeight.toString()}
                onValueChange={handleFontWeightChange}
              >
                <SelectTrigger id={`font-weight-${container.id}`}>
                  <SelectValue placeholder="Select weight" />
                </SelectTrigger>
                <SelectContent>
                  {fontWeightOptions.map((weight) => (
                    <SelectItem
                      key={weight.value}
                      value={weight.value.toString()}
                    >
                      {weight.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* --- End Font Weight Select --- */}
          </div>

          {/* ... (Rest of the controls: FontSize, Colors, Margins, Delay remain the same) ... */}
          <SliderWithInput // font size
            id={`font-size-${container.id}`}
            label="Font Size"
            min={0.5}
            max={5}
            step={0.1}
            value={container.fontSize}
            onChange={(value) => handleUpdate({ fontSize: value })}
            unit="rem"
          />

          <ColorPickerWithInput // text color light
            id={`text-color-${container.id}`}
            label="Text Color (Light)"
            value={container.textColor}
            onChange={(value) => handleUpdate({ textColor: value })}
          />

          <ColorPickerWithInput // text color dark
            id={`text-color-dark-${container.id}`}
            label="Text Color (Dark)"
            value={container.textColorDark}
            onChange={(value) => handleUpdate({ textColorDark: value })}
          />

          <SliderWithInput // margin top
            id={`margin-top-${container.id}`}
            label="Margin Top"
            // ... props
            min={0}
            max={64}
            step={1}
            value={container.marginTop}
            onChange={(value) => handleUpdate({ marginTop: value })}
            unit="px"
          />

          <SliderWithInput //margin botom
            id={`margin-bottom-${container.id}`}
            label="Margin Bottom"
            // ... props
            min={0}
            max={64}
            step={1}
            value={container.marginBottom}
            onChange={(value) => handleUpdate({ marginBottom: value })}
            unit="px"
          />

          <SliderWithInput // anim. delay
            id={`delay-${container.id}`}
            label="Animation Delay"
            // ... props
            min={0}
            max={2}
            step={0.05}
            value={container.delay}
            onChange={(value) => handleUpdate({ delay: value })}
            unit="s"
          />
        </div>
      </CardContent>
    </Card>
  );
}
