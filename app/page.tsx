import TextStylingPlayground from "@/components/text-styling-playground"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Text Styling and Animation Playground</h1>
        <p className="text-center mb-8 text-muted-foreground">
          Create beautiful animated text with customizable styling and dark mode support
        </p>
        <TextStylingPlayground />
      </main>
    </ThemeProvider>
  )
}

