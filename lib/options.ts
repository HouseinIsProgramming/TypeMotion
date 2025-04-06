import moreFonts from "./moreFonts.json";

export const fontDefaults = [
  { value: "Inter", label: "Inter" },
  { value: "Arial", label: "Arial" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "Georgia", label: "Georgia" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Courier New", label: "Courier New" },
  { value: "Verdana", label: "Verdana" },
  { value: "Tahoma", label: "Tahoma" },
  { value: "Trebuchet MS", label: "Trebuchet MS" },
  { value: "Impact", label: "Impact" },
  { value: "Comic Sans MS", label: "Comic Sans MS" },
];

const shorterList = moreFonts.slice(0, 300);

export const fontOptions = [...shorterList];

export const fontWeightOptions = [
  { value: "100", label: "100 (Thin)" },
  { value: "200", label: "200 (Extra Light)" },
  { value: "300", label: "300 (Light)" },
  { value: "400", label: "400 (Regular)" },
  { value: "500", label: "500 (Medium)" },
  { value: "600", label: "600 (Semi Bold)" },
  { value: "700", label: "700 (Bold)" },
  { value: "800", label: "800 (Extra Bold)" },
  { value: "900", label: "900 (Black)" },
  { value: "normal", label: "Normal" },
  { value: "bold", label: "Bold" },
];

export const easingOptions = [
  { value: "linear", label: "Linear" },
  { value: "easeInOut", label: "Ease In Out" },
  { value: "easeIn", label: "Ease In" },
  { value: "easeOut", label: "Ease Out" },
  { value: "circIn", label: "Circular In" },
  { value: "circOut", label: "Circular Out" },
  { value: "circInOut", label: "Circular In Out" },
  { value: "backIn", label: "Back In" },
  { value: "backOut", label: "Back Out" },
  { value: "backInOut", label: "Back In Out" },
  { value: "anticipate", label: "Anticipate" },
];

export const staggerTypeOptions = [
  { value: "letter", label: "Letter" },
  { value: "word", label: "Word" },
  { value: "line", label: "Line" },
];
