"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import PreviewArea from "./preview-area"
import ControlPanel from "./control-panel"
import type { TextStyleConfig } from "@/types/text-style-config"
import { v4 as uuidv4 } from "uuid"
import type { TextContainer } from "@/types/text-style-config"
import { ThemeToggle } from "./theme-toggle"

const defaultConfig: TextStyleConfig = {
  backgroundColor: "#ffffff",
  backgroundColorDark: "#1e1e2e", // Dark mode background color
  borderRadius: 8,
  padding: {
    top: 16,
    right: 24,
    bottom: 16,
    left: 24,
  },
  textContainers: [
    {
      id: uuidv4(),
      text: "Edit this text to see changes in real-time!",
      fontFamily: "Inter",
      fontSize: 1.5, // 1.5rem
      textColor: "#000000",
      textColorDark: "#ffffff", // Dark mode text color
      fontWeight: 400, // Default font weight
      marginTop: 0,
      marginBottom: 0,
      delay: 0, // No delay by default
    },
  ],
  animation: {
    initialX: -5, // Default as specified
    initialY: 0,
    initialOpacity: 0, // Default as specified
    initialBlur: 6, // Default as specified
    initialRotation: 0,
    duration: 0.5, // Default as specified
    type: "tween",
    ease: "easeInOut", // Default as specified
    stiffness: 100,
    damping: 10,
    mass: 1,
    animateCard: false, // Default as specified
    stagger: {
      enabled: true, // Default as specified
      type: "letter", // Default as specified
      amount: 0.04, // Default as specified
    },
  },
}

export default function TextStylingPlayground() {
  const [config, setConfig] = useState<TextStyleConfig>(defaultConfig)
  const [animationKey, setAnimationKey] = useState(0)

  const updateConfig = (updates: Partial<TextStyleConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }

  const replayAnimation = () => {
    setAnimationKey((prev) => prev + 1)
  }

  const addTextContainer = () => {
    const newContainer = {
      id: uuidv4(),
      text: "New text container",
      fontFamily: "Inter",
      fontSize: 1,
      textColor: "#000000",
      textColorDark: "#ffffff", // Dark mode text color
      fontWeight: 400, // Default font weight
      marginTop: 16,
      marginBottom: 0,
      delay: 0,
    }

    updateConfig({
      textContainers: [...config.textContainers, newContainer],
    })
  }

  const updateTextContainer = (id: string, updates: Partial<Omit<TextContainer, "id">>) => {
    const updatedContainers = config.textContainers.map((container) =>
      container.id === id ? { ...container, ...updates } : container,
    )

    updateConfig({ textContainers: updatedContainers })
  }

  const removeTextContainer = (id: string) => {
    if (config.textContainers.length <= 1) return // Keep at least one container

    const updatedContainers = config.textContainers.filter((container) => container.id !== id)

    updateConfig({ textContainers: updatedContainers })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Preview</h2>
            <button
              onClick={replayAnimation}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              aria-label="Replay animation"
            >
              Replay Animation
            </button>
          </div>
          <PreviewArea config={config} animationKey={animationKey} />
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          <ControlPanel
            config={config}
            updateConfig={updateConfig}
            addTextContainer={addTextContainer}
            updateTextContainer={updateTextContainer}
            removeTextContainer={removeTextContainer}
          />
        </Card>
      </div>
    </div>
  )
}

