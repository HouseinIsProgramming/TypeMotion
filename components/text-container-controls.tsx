"use client";

import { useEffect } from "react"; // Import useEffect for potential initial load
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TextContainer } from "@/types/text-style-config";
import { fontOptions, fontWeightOptions } from "@/lib/options";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SliderWithInput from "./slider-with-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ColorPickerWithInput from "./color-picker-with-input";
// REMOVE: import { createGoogleFontsFetch } from "@frontlabsofficial/google-fonts-fetch";

// REMOVE: const fetchGoogleFont = createGoogleFontsFetch();

// --- Helper Function to Load Google Fonts ---
function loadGoogleFont(fontFamily: string, weight: string | number) {
  if (!fontFamily || !weight) {
    console.warn("Missing font family or weight for loading.");
    return;
  }

  const familyForUrl = fontFamily.replace(/ /g, "+");
  // Assuming weight is always numeric here based on fontWeightOptions values
  const numericWeight =
    typeof weight === "string" ? parseInt(weight, 10) : weight;

  // Create a unique ID for the link tag to prevent duplicates
  // Note: This simple ID assumes non-italic for now. Add italic if needed.
  const fontId = `google-font-${familyForUrl}-${numericWeight}-normal`;

  // Check if this specific font variation is already requested
  if (document.getElementById(fontId)) {
    // console.log(`${fontFamily} (${numericWeight}) already loaded or requested.`);
    return;
  }

  // Construct the Google Fonts API URL (v2)
  // Basic implementation: Loads only the specified weight.
  // Add italic handling or multiple weights if needed later.
  let apiUrl = `https://fonts.googleapis.com/css2?family=${familyForUrl}`;
  apiUrl += `:wght@${numericWeight}`; // Request specific weight
  apiUrl += "&display=swap"; // Recommended for performance

  console.log(`Requesting Google Font: ${apiUrl}`);

  // Create the <link> element
  const link = document.createElement("link");
  link.id = fontId; // Add ID to check later
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = apiUrl;

  // Append the <link> element to the <head>
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
  // --- Optional: Load initial font on mount ---
  // If you want the font defined in the initial 'container' prop
  // to be loaded when the component first renders.
  useEffect(() => {
    if (container.fontFamily && container.fontWeight) {
      loadGoogleFont(container.fontFamily, container.fontWeight);
    }
    // Run only once on mount, or when container ID changes if that's possible
  }, [container.id]); // Adjust dependencies if needed, but often just mount is fine.
  // --- End Optional Initial Load ---

  const handleUpdate = (updates: Partial<Omit<TextContainer, "id">>) => {
    updateTextContainer(container.id, updates);
  };

  const handleFontFamilyChange = (newFontFamily: string) => {
    // 1. Load the new font family (using the current weight)
    loadGoogleFont(newFontFamily, container.fontWeight);
    // 2. Update the state
    handleUpdate({ fontFamily: newFontFamily });
  };

  const handleFontWeightChange = (newFontWeight: string) => {
    // 1. Load the font family with the new weight
    loadGoogleFont(container.fontFamily, newFontWeight); // Use current family
    // 2. Update the state (ensure weight is stored correctly, e.g., as string or number)
    // Assuming your state expects a string based on usage with Select value
    handleUpdate({ fontWeight: newFontWeight });
  };

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
          <div className="space-y-2">
            <Label htmlFor={`text-content-${container.id}`}>Text Content</Label>
            <Input
              id={`text-content-${container.id}`}
              value={container.text}
              onChange={(e) => handleUpdate({ text: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`font-family-${container.id}`}>Font Family</Label>
            <Select
              value={container.fontFamily}
              // Use the specific handler
              onValueChange={handleFontFamilyChange}
            >
              <SelectTrigger id={`font-family-${container.id}`}>
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`font-weight-${container.id}`}>Font Weight</Label>
            <Select
              // Ensure value is a string if handleUpdate expects string
              value={container.fontWeight.toString()}
              // Use the specific handler
              onValueChange={handleFontWeightChange}
            >
              <SelectTrigger id={`font-weight-${container.id}`}>
                <SelectValue placeholder="Select weight" />
              </SelectTrigger>
              <SelectContent>
                {fontWeightOptions.map((weight) => (
                  // Ensure weight.value is string if needed
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

          {/* ... (Rest of the controls: FontSize, Colors, Margins, Delay) ... */}
          <SliderWithInput
            id={`font-size-${container.id}`}
            label="Font Size"
            min={0.5}
            max={5}
            step={0.1}
            value={container.fontSize}
            onChange={(value) => handleUpdate({ fontSize: value })}
            unit="rem"
          />

          <Tabs defaultValue="light" className="w-full">
            <TabsList className="grid grid-cols-2 mb-2">
              <TabsTrigger value="light">Light Mode</TabsTrigger>
              <TabsTrigger value="dark">Dark Mode</TabsTrigger>
            </TabsList>

            <TabsContent value="light" className="space-y-4 pt-2">
              <ColorPickerWithInput
                id={`text-color-${container.id}`}
                label="Text Color (Light)"
                value={container.textColor}
                onChange={(value) => handleUpdate({ textColor: value })}
              />
            </TabsContent>

            <TabsContent value="dark" className="space-y-4 pt-2">
              <ColorPickerWithInput
                id={`text-color-dark-${container.id}`}
                label="Text Color (Dark)"
                value={container.textColorDark}
                onChange={(value) => handleUpdate({ textColorDark: value })}
              />
            </TabsContent>
          </Tabs>

          <SliderWithInput
            id={`margin-top-${container.id}`}
            label="Margin Top"
            min={0}
            max={64}
            step={1}
            value={container.marginTop}
            onChange={(value) => handleUpdate({ marginTop: value })}
            unit="px"
          />

          <SliderWithInput
            id={`margin-bottom-${container.id}`}
            label="Margin Bottom"
            min={0}
            max={64}
            step={1}
            value={container.marginBottom}
            onChange={(value) => handleUpdate({ marginBottom: value })}
            unit="px"
          />

          <SliderWithInput
            id={`delay-${container.id}`}
            label="Animation Delay"
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
