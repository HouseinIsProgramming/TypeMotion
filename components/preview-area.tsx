"use client";

import { motion } from "framer-motion";
import type { TextStyleConfig, TextContainer } from "@/types/text-style-config";
import { splitTextByType } from "@/lib/text-utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface PreviewAreaProps {
  config: TextStyleConfig;
  animationKey: number;
}

export default function PreviewArea({
  config,
  animationKey,
}: PreviewAreaProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && theme === "dark";

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
        };

  const cardStyle = {
    backgroundColor: isDarkMode
      ? config.backgroundColorDark
      : config.backgroundColor,
    borderRadius: `${config.borderRadius}px`,
    padding: `${config.padding.top}px ${config.padding.right}px ${config.padding.bottom}px ${config.padding.left}px`,
  };

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
    : {};

  const renderTextContent = (container: TextContainer) => {
    const containerStyle = {
      color: isDarkMode ? container.textColorDark : container.textColor,
      fontSize: `${container.fontSize}rem`,
      fontFamily: container.fontFamily,
      fontWeight: container.fontWeight,
      marginTop: `${container.marginTop}px`,
      marginBottom: `${container.marginBottom}px`,
    };

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
        : {};

    if (!config.animation.stagger.enabled || config.animation.animateCard) {
      return (
        <motion.div
          key={`text-${container.id}-${animationKey}`}
          style={containerStyle}
          {...(!config.animation.animateCard ? containerAnimationProps : {})}
        >
          {container.text}
        </motion.div>
      );
    }

    if (config.animation.stagger.type === "letter") {
      const wordsAndSpaces = container.text.split(/(\s+)/);
      const staggerContainerVariants = {
        animate: {
          transition: {
            staggerChildren: config.animation.stagger.amount,
            delayChildren: container.delay,
          },
        },
      };
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
      };

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
            if (part.match(/\s+/)) {
              return (
                <span key={`space-${partIndex}`} className="whitespace-pre">
                  {part}
                </span>
              );
            }

            const letters = part.split("");
            return (
              <span
                key={`word-${partIndex}`}
                className="inline-flex whitespace-nowrap"
              >
                {letters.map((letter, letterIndex) => (
                  <motion.span
                    key={`letter-${letterIndex}`}
                    variants={staggerChildVariants}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            );
          })}
        </motion.div>
      );
    } else {
      const textParts = splitTextByType(
        container.text,
        config.animation.stagger.type,
      );
      const staggerContainerVariants = {
        animate: {
          transition: {
            staggerChildren: config.animation.stagger.amount,
            delayChildren: container.delay,
          },
        },
      };
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
      };

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
                marginRight:
                  config.animation.stagger.type === "word" ? "0.25em" : "0",
                whiteSpace:
                  config.animation.stagger.type === "line"
                    ? "pre-wrap"
                    : "normal",
              }}
            >
              {part}
            </motion.span>
          ))}
        </motion.div>
      );
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[300px] bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="w-full" style={cardStyle}>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-center min-h-[300px] bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <motion.div
        key={`card-${animationKey}`}
        className="w-full"
        {...cardAnimationProps}
        style={cardStyle}
      >
        {config.textContainers.map((container) => renderTextContent(container))}
      </motion.div>
    </div>
  );
}
