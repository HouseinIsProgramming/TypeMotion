// control-panel.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { Copy, Plus, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import TextContainerControls from "./text-container-controls";
import SliderWithInput from "./slider-with-input";
import ColorPickerWithInput from "./color-picker-with-input";
import { cn } from "@/lib/utils";

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
  const [isCopying, setIsCopying] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const copySuccessTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    return () => {
      if (copySuccessTimeoutRef.current) {
        clearTimeout(copySuccessTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyJson = async () => {
    if (copySuccessTimeoutRef.current) {
      clearTimeout(copySuccessTimeoutRef.current);
      copySuccessTimeoutRef.current = null;
    }
    setShowCopySuccess(false);
    setIsCopying(true);
    const jsonString = JSON.stringify(config, null, 2);

    try {
      await navigator.clipboard.writeText(jsonString);
      setShowCopySuccess(true);
      copySuccessTimeoutRef.current = setTimeout(() => {
        setShowCopySuccess(false);
        copySuccessTimeoutRef.current = null;
      }, 3000); // 3 seconds
    } catch (err) {
      console.error("Failed to copy settings: ", err);
    } finally {
      setIsCopying(false);
    }
  };

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
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            Add Text Container
          </Button>
        </TabsContent>

        <TabsContent value="style" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 *:flex-grow *:basis-1/2">
            <ColorPickerWithInput
              id="background-color"
              label="Background Color (Light)"
              value={config.backgroundColor}
              onChange={(value) => updateConfig({ backgroundColor: value })}
            />
            <ColorPickerWithInput
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
      </Tabs>

      <div className="pt-4 border-t text-center relative">
        {showCopySuccess && (
          <Card className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-700 shadow-lg w-auto whitespace-nowrap">
            <CardContent className="p-2">
              <div className="flex items-center justify-center gap-1.5 text-sm text-green-700 dark:text-green-400">
                <Check className="h-4 w-4" />
                <span>Copied!</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Button
          onClick={handleCopyJson}
          disabled={isCopying}
          className="w-full flex items-center justify-center gap-2"
        >
          <Copy className="h-4 w-4" />
          {isCopying ? "Copying..." : "Copy Settings JSON"}
        </Button>
      </div>
    </div>
  );
}
