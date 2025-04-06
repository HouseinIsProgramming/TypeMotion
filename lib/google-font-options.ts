import { createGoogleFontsFetch as fetchFont } from "@frontlabsofficial/google-fonts-fetch";
import { writeFile } from "fs/promises";

// Define the Google Fonts API URL and API key
const apiKey: string = "AIzaSyDrN3UeVv7u8_KFiNBHnX9yCJWfDUgl3ns";
const url: string = `https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${apiKey}`;

// Define the structure of each Google Font object
interface GoogleFont {
  family: string;
  [key: string]: any;
}

// Define the structure of the font options output
interface FontOption {
  value: string;
  label: string;
}

async function getFontOptions(): Promise<FontOption[] | void> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("HTTP ERROR " + response.status);
    }

    const data: { items: GoogleFont[] } = await response.json();

    const names: string[] = data.items.map((font) => font.family);

    const fontOptions: FontOption[] = names.map((name) => ({
      value: name,
      label: name,
    }));

    // const fontOptionJSON = JSON.parse(fontOptions);

    console.log("✅ Successfully fetched and formatted fonts.");
    console.log(fontOptions.slice(0, 10));
    console.log(fontOptions.length);
    await writeFile(
      "./lib/moreFonts.json",
      JSON.stringify(fontOptions, null, 2),
      "utf-8",
    );

    return fontOptions;
  } catch (err) {
    console.error("❌ Error fetching or processing fonts:", err);
  }
}

getFontOptions();
