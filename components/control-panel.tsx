// control-panel.tsx

"use client";

// --- ADD THESE IMPORTS ---
import { useState, useRef, useEffect } from "react";
import { Copy } from "lucide-react"; // Make sure Copy icon is imported
// --- END ADDED IMPORTS ---

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  TextStyleConfig,
  TextContainer,
  StaggerType,
} from "@/types/text-style-config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { easingOptions } from "@/lib/options";
import { Button } from "@/components/ui/button"; // Ensure Button is imported
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react"; // Ensure Plus is imported
import TextContainerControls from "./text-container-controls";
import SliderWithInput from "./slider-with-input";
import ColorPickerWithInput from "./color-picker-with-input";

interface ControlPanelProps {
  config: TextStyleConfig;
  updateConfig: (updates: Partial<TextStyleConfig>) => void;
  addTextContainer: () => void;
  updateTextContainer: (
    id: string,
    updates: Partial<Omit<TextContainer, "id">>,
  ) => void;
  removeTextContainer: (id: string) => void;
}

export default function ControlPanel({
  config,
  updateConfig,
  addTextContainer,
  updateTextContainer,
  removeTextContainer,
}: ControlPanelProps) {
  // --- ADD STATE and REF for Copy Button ---
  const [isCopying, setIsCopying] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const copySuccessTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // --- END ADDED STATE and REF ---

  // --- Existing handlers (untouched) ---
  const updatePadding = (key: keyof typeof config.padding, value: number) => {
    updateConfig({
      padding: {
        ...config.padding,
        [key]: value,
      },
    });
  };

  const updateAnimation = (
    key: keyof typeof config.animation,
    value: string | number | boolean,
  ) => {
    updateConfig({
      animation: {
        ...config.animation,
        [key]: value,
      },
    });
  };

  const updateStagger = (
    key: keyof typeof config.animation.stagger,
    value: string | number | boolean,
  ) => {
    updateConfig({
      animation: {
        ...config.animation,
        stagger: {
          ...config.animation.stagger,
          [key]: value,
        },
      },
    });
  };
  // --- End Existing handlers ---

  // --- ADD EFFECT for Copy Timeout Cleanup ---
  useEffect(() => {
    // Return cleanup function
    return () => {
      if (copySuccessTimeoutRef.current) {
        clearTimeout(copySuccessTimeoutRef.current);
      }
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount
  // --- END ADDED EFFECT ---

  // --- ADD HANDLER for Copying JSON ---
  const handleCopyJson = async () => {
    // Clear any existing timeout before starting a new copy action
    if (copySuccessTimeoutRef.current) {
      clearTimeout(copySuccessTimeoutRef.current);
      copySuccessTimeoutRef.current = null; // Reset ref
    }
    setShowCopySuccess(false); // Ensure message is hidden initially if clicked again quickly
    setIsCopying(true);
    const jsonString = JSON.stringify(config, null, 2); // Pretty-print JSON

    try {
      await navigator.clipboard.writeText(jsonString);
      setShowCopySuccess(true); // Show the success message
      // Set a timeout to hide the message after 2 seconds
      copySuccessTimeoutRef.current = setTimeout(() => {
        setShowCopySuccess(false);
        copySuccessTimeoutRef.current = null; // Reset ref after timeout
      }, 2000); // 2000 milliseconds = 2 seconds
    } catch (err) {
      console.error("Failed to copy settings: ", err);
      // No failure notification shown inline as per requirement
    } finally {
      setIsCopying(false);
    }
  };
  // --- END ADDED HANDLER ---

  // --- Existing JSX Return starts here ---
  return (
    <div className="space-y-6">
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="style">Card</TabsTrigger>
          <TabsTrigger value="animation">Animation</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <div className="space-y-4">
            {config.textContainers.map((container) => (
              <TextContainerControls
                key={container.id}
                container={container}
                updateTextContainer={updateTextContainer}
                removeTextContainer={removeTextContainer}
                canRemove={config.textContainers.length > 1}
              />
            ))}
          </div>

          <Button
            onClick={addTextContainer}
            className="w-full flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Text Container
          </Button>
        </TabsContent>

        <TabsContent value="style" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 *:flex-grow *:basis-1/2">
            <ColorPickerWithInput // light color selctor
              id="background-color"
              label="Background Color (Light)"
              value={config.backgroundColor}
              onChange={(value) => updateConfig({ backgroundColor: value })}
            />
            <ColorPickerWithInput // dark color selctor
              id="background-color-dark"
              label="Background Color (Dark)"
              value={config.backgroundColorDark}
              onChange={(value) => updateConfig({ backgroundColorDark: value })}
            />
          </div>

          <SliderWithInput
            id="border-radius"
            label="Border Radius"
            min={0}
            max={32}
            step={1}
            value={config.borderRadius}
            onChange={(value) => updateConfig({ borderRadius: value })}
            unit="px"
          />

          <div className="space-y-4">
            <Label>Padding</Label>
            <div className="grid grid-cols-2 gap-4">
              <SliderWithInput
                id="padding-top"
                label="Top"
                min={0}
                max={64}
                step={1}
                value={config.padding.top}
                onChange={(value) => updatePadding("top", value)}
                unit="px"
              />
              <SliderWithInput
                id="padding-right"
                label="Right"
                min={0}
                max={64}
                step={1}
                value={config.padding.right}
                onChange={(value) => updatePadding("right", value)}
                unit="px"
              />
              <SliderWithInput
                id="padding-bottom"
                label="Bottom"
                min={0}
                max={64}
                step={1}
                value={config.padding.bottom}
                onChange={(value) => updatePadding("bottom", value)}
                unit="px"
              />
              <SliderWithInput
                id="padding-left"
                label="Left"
                min={0}
                max={64}
                step={1}
                value={config.padding.left}
                onChange={(value) => updatePadding("left", value)}
                unit="px"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="animation" className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="animate-card"
              checked={config.animation.animateCard}
              onCheckedChange={(checked) =>
                updateAnimation("animateCard", checked === true)
              }
            />
            <Label htmlFor="animate-card">
              Animate Card (uncheck to animate text containers)
            </Label>
          </div>

          {!config.animation.animateCard && (
            <div className="space-y-4 p-4 border rounded-md bg-muted/20">
              <h3 className="font-medium">Staggered Text Animation</h3>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="stagger-enabled"
                  checked={config.animation.stagger.enabled}
                  onCheckedChange={(checked) =>
                    updateStagger("enabled", checked === true)
                  }
                />
                <Label htmlFor="stagger-enabled">
                  Enable Staggered Animation
                </Label>
              </div>

              {config.animation.stagger.enabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="stagger-type">Stagger By</Label>
                    <Select
                      value={config.animation.stagger.type}
                      onValueChange={(value) =>
                        updateStagger("type", value as StaggerType)
                      }
                    >
                      <SelectTrigger id="stagger-type">
                        <SelectValue placeholder="Select stagger type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="letter">Letter</SelectItem>
                        <SelectItem value="word">Word</SelectItem>
                        <SelectItem value="line">Line</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <SliderWithInput
                    id="stagger-amount"
                    label="Stagger Amount"
                    min={0.01}
                    max={0.5}
                    step={0.01}
                    value={config.animation.stagger.amount}
                    onChange={(value) => updateStagger("amount", value)}
                    unit="s"
                  />
                </>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="animation-type">Animation Type</Label>
            <Select
              value={config.animation.type}
              onValueChange={(value) =>
                updateAnimation("type", value as "tween" | "spring")
              }
            >
              <SelectTrigger id="animation-type">
                <SelectValue placeholder="Select animation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tween">Tween</SelectItem>
                <SelectItem value="spring">Spring</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <SliderWithInput
            id="initial-x"
            label="Initial X"
            min={-200}
            max={200}
            step={1}
            value={config.animation.initialX}
            onChange={(value) => updateAnimation("initialX", value)}
            unit="px"
          />

          <SliderWithInput
            id="initial-y"
            label="Initial Y"
            min={-200}
            max={200}
            step={1}
            value={config.animation.initialY}
            onChange={(value) => updateAnimation("initialY", value)}
            unit="px"
          />

          <SliderWithInput
            id="initial-opacity"
            label="Initial Opacity"
            min={0}
            max={1}
            step={0.01}
            value={config.animation.initialOpacity}
            onChange={(value) => updateAnimation("initialOpacity", value)}
          />

          <SliderWithInput
            id="initial-blur"
            label="Initial Blur"
            min={0}
            max={20}
            step={0.5}
            value={config.animation.initialBlur}
            onChange={(value) => updateAnimation("initialBlur", value)}
            unit="px"
          />

          <SliderWithInput
            id="initial-rotation"
            label="Initial Rotation"
            min={-180}
            max={180}
            step={1}
            value={config.animation.initialRotation}
            onChange={(value) => updateAnimation("initialRotation", value)}
            unit="°"
          />

          {config.animation.type === "tween" ? (
            <>
              <SliderWithInput
                id="animation-duration"
                label="Duration"
                min={0.1}
                max={3}
                step={0.1}
                value={config.animation.duration}
                onChange={(value) => updateAnimation("duration", value)}
                unit="s"
              />

              <div className="space-y-2">
                <Label htmlFor="animation-ease">Easing Function</Label>
                <Select
                  value={config.animation.ease}
                  onValueChange={(value) => updateAnimation("ease", value)}
                >
                  <SelectTrigger id="animation-ease">
                    <SelectValue placeholder="Select easing" />
                  </SelectTrigger>
                  <SelectContent>
                    {easingOptions.map((ease) => (
                      <SelectItem key={ease.value} value={ease.value}>
                        {ease.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              <SliderWithInput
                id="animation-stiffness"
                label="Stiffness"
                min={10}
                max={500}
                step={5}
                value={config.animation.stiffness}
                onChange={(value) => updateAnimation("stiffness", value)}
              />

              <SliderWithInput
                id="animation-damping"
                label="Damping"
                min={1}
                max={100}
                step={1}
                value={config.animation.damping}
                onChange={(value) => updateAnimation("damping", value)}
              />

              <SliderWithInput
                id="animation-mass"
                label="Mass"
                min={0.1}
                max={10}
                step={0.1}
                value={config.animation.mass}
                onChange={(value) => updateAnimation("mass", value)}
              />
            </>
          )}
        </TabsContent>
      </Tabs>{" "}
      {/* End Tabs component */}
      {/* --- ADD THIS SECTION AT THE VERY BOTTOM --- */}
      <div className="pt-4 border-t text-center">
        {/* Conditional Success Message */}
        {showCopySuccess && (
          <p className="text-sm text-green-600 mb-2 animate-pulse">Copied!</p>
        )}

        {/* The Copy Button */}
        <Button
          onClick={handleCopyJson}
          disabled={isCopying}
          className="w-full flex items-center justify-center gap-2"
        >
          <Copy className="h-4 w-4" />
          {isCopying ? "Copying..." : "Copy Settings JSON"}
        </Button>
      </div>
      {/* --- END ADDED SECTION --- */}
    </div> // End main wrapping div
  );
}
