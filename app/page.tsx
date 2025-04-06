import TextStylingPlayground from "@/components/text-styling-playground";
import { ThemeProvider } from "@/components/theme-provider";
import Logo from "@/components/svg/TypeMotion.svg";

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <main className="container mx-auto py-8 px-4">
        <img
          src={Logo.src}
          height={50}
          className="mx-auto drop-shadow-lg my-4 dark:invert"
        />
        <h1 className="text-3xl font-bold mb-6 text-center sr-only">
          TypeMotion
        </h1>
        <p className="text-center mb-8 text-muted-foreground">
          Create beautiful animated text with customizable styling and dark mode
          support
        </p>
        <TextStylingPlayground />
      </main>
    </ThemeProvider>
  );
}
