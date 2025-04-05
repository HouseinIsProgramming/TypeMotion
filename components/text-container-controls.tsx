"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { TextContainer } from "@/types/text-style-config"
import { fontOptions, fontWeightOptions } from "@/lib/options"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import SliderWithInput from "./slider-with-input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ColorPickerWithInput from "./color-picker-with-input"

interface TextContainerControlsProps {
  container: TextContainer
  updateTextContainer: (id: string, updates: Partial<Omit<TextContainer, "id">>) => void
  removeTextContainer: (id: string) => void
  canRemove: boolean
}

export default function TextContainerControls({
  container,
  updateTextContainer,
  removeTextContainer,
  canRemove,
}: TextContainerControlsProps) {
  const handleUpdate = (updates: Partial<Omit<TextContainer, "id">>) => {
    updateTextContainer(container.id, updates)
  }

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
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
            <Select value={container.fontFamily} onValueChange={(value) => handleUpdate({ fontFamily: value })}>
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
              value={container.fontWeight.toString()}
              onValueChange={(value) => handleUpdate({ fontWeight: value })}
            >
              <SelectTrigger id={`font-weight-${container.id}`}>
                <SelectValue placeholder="Select weight" />
              </SelectTrigger>
              <SelectContent>
                {fontWeightOptions.map((weight) => (
                  <SelectItem key={weight.value} value={weight.value}>
                    {weight.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
  )
}

