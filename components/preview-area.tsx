"use client"

import { motion } from "framer-motion"
import type { TextStyleConfig, TextContainer } from "@/types/text-style-config"
import { splitTextByType } from "@/lib/text-utils"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface PreviewAreaProps {
  config: TextStyleConfig
  animationKey: number
}

export default function PreviewArea({ config, animationKey }: PreviewAreaProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine if we're in dark mode
  const isDarkMode = mounted && theme === "dark"

  // Create transition based on animation type
  const transition =
    config.animation.type === "spring"
      ? {
          type: "spring",
          stiffness: config.animation.stiffness,
          damping: config.animation.damping,
          mass: config.animation.mass,
        }
      : {
          type: "tween",
          duration: config.animation.duration,
          ease: config.animation.ease,
        }

  const cardStyle = {
    backgroundColor: isDarkMode ? config.backgroundColorDark : config.backgroundColor,
    borderRadius: `${config.borderRadius}px`,
    padding: `${config.padding.top}px ${config.padding.right}px ${config.padding.bottom}px ${config.padding.left}px`,
  }

  // Animation properties for the card
  const cardAnimationProps = config.animation.animateCard
    ? {
        initial: {
          x: config.animation.initialX,
          y: config.animation.initialY,
          opacity: config.animation.initialOpacity,
          filter: `blur(${config.animation.initialBlur}px)`,
          rotate: config.animation.initialRotation,
        },
        animate: {
          x: 0,
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          rotate: 0,
        },
        transition: transition,
      }
    : {}

  // Function to render text with stagger if enabled
  const renderTextContent = (container: TextContainer) => {
    // Base container style
    const containerStyle = {
      color: isDarkMode ? container.textColorDark : container.textColor,
      fontSize: `${container.fontSize}rem`,
      fontFamily: container.fontFamily,
      fontWeight: container.fontWeight,
      marginTop: `${container.marginTop}px`,
      marginBottom: `${container.marginBottom}px`,
    }

    // Container animation props when card is not animated
    const containerAnimationProps =
      !config.animation.animateCard && !config.animation.stagger.enabled
        ? {
            initial: {
              x: config.animation.initialX,
              y: config.animation.initialY,
              opacity: config.animation.initialOpacity,
              filter: `blur(${config.animation.initialBlur}px)`,
              rotate: config.animation.initialRotation,
            },
            animate: {
              x: 0,
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              rotate: 0,
            },
            transition: {
              ...transition,
              delay: container.delay,
            },
          }
        : {}

    // If stagger is not enabled or card is animated, render simple container
    if (!config.animation.stagger.enabled || config.animation.animateCard) {
      return (
        <motion.div
          key={`text-${container.id}-${animationKey}`}
          style={containerStyle}
          {...(!config.animation.animateCard ? containerAnimationProps : {})}
        >
          {container.text}
        </motion.div>
      )
    }

    // For letter staggering, we need to handle words differently to prevent mid-word wrapping
    if (config.animation.stagger.type === "letter") {
      // Split text into words and spaces
      const wordsAndSpaces = container.text.split(/(\s+)/)

      // Stagger container variants
      const staggerContainerVariants = {
        animate: {
          transition: {
            staggerChildren: config.animation.stagger.amount,
            delayChildren: container.delay,
          },
        },
      }

      // Stagger child variants
      const staggerChildVariants = {
        initial: {
          x: config.animation.initialX,
          y: config.animation.initialY,
          opacity: config.animation.initialOpacity,
          filter: `blur(${config.animation.initialBlur}px)`,
          rotate: config.animation.initialRotation,
        },
        animate: {
          x: 0,
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          rotate: 0,
          transition: transition,
        },
      }

      return (
        <motion.div
          key={`text-${container.id}-${animationKey}`}
          style={containerStyle}
          variants={staggerContainerVariants}
          initial="initial"
          animate="animate"
          className="flex flex-wrap"
        >
          {wordsAndSpaces.map((part, partIndex) => {
            // If it's a space, preserve it exactly as is
            if (part.match(/\s+/)) {
              return (
                <span key={`space-${partIndex}`} className="whitespace-pre">
                  {part}
                </span>
              )
            }

            // Otherwise, split the word into letters for animation
            const letters = part.split("")

            return (
              <span key={`word-${partIndex}`} className="inline-flex whitespace-nowrap">
                {letters.map((letter, letterIndex) => (
                  <motion.span key={`letter-${letterIndex}`} variants={staggerChildVariants} className="inline-block">
                    {letter}
                  </motion.span>
                ))}
              </span>
            )
          })}
        </motion.div>
      )
    } else {
      // For word and line staggering, use the existing approach
      const textParts = splitTextByType(container.text, config.animation.stagger.type)

      // Stagger container variants
      const staggerContainerVariants = {
        animate: {
          transition: {
            staggerChildren: config.animation.stagger.amount,
            delayChildren: container.delay,
          },
        },
      }

      // Stagger child variants
      const staggerChildVariants = {
        initial: {
          x: config.animation.initialX,
          y: config.animation.initialY,
          opacity: config.animation.initialOpacity,
          filter: `blur(${config.animation.initialBlur}px)`,
          rotate: config.animation.initialRotation,
        },
        animate: {
          x: 0,
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          rotate: 0,
          transition: transition,
        },
      }

      return (
        <motion.div
          key={`text-${container.id}-${animationKey}`}
          style={containerStyle}
          variants={staggerContainerVariants}
          initial="initial"
          animate="animate"
        >
          {textParts.map((part, index) => (
            <motion.span
              key={`part-${index}`}
              variants={staggerChildVariants}
              style={{
                display: "inline-block",
                marginRight: config.animation.stagger.type === "word" ? "0.25em" : "0",
                whiteSpace: config.animation.stagger.type === "line" ? "pre-wrap" : "normal",
              }}
            >
              {part}
            </motion.span>
          ))}
        </motion.div>
      )
    }
  }

  // If not mounted yet, show a placeholder with the same dimensions
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[300px] bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="w-full" style={cardStyle}>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[300px] bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <motion.div key={`card-${animationKey}`} className="w-full" {...cardAnimationProps} style={cardStyle}>
        {config.textContainers.map((container) => renderTextContent(container))}
      </motion.div>
    </div>
  )
}

