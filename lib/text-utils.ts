import type { StaggerType } from "@/types/text-style-config"

export function splitTextByType(text: string, type: StaggerType): string[] {
  if (type === "none") return [text]

  if (type === "letter") {
    return text.split("")
  }

  if (type === "word") {
    // Split by whitespace but preserve the spaces
    const parts: string[] = []
    const words = text.split(/(\s+)/)

    for (const word of words) {
      if (word.trim() !== "") {
        parts.push(word)
      } else if (word !== "") {
        // Add a space with the same width as the original space
        parts.push(word)
      }
    }

    return parts
  }

  if (type === "line") {
    // Split by newlines and filter out empty lines
    return text.split(/\r?\n/).filter((line) => line.length > 0)
  }

  return [text]
}

