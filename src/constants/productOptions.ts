// File: app/constants/productOptions.ts

export const brandList = [
  "Razer", "Nubwo", "Logitech", "Signo", "SteelSeries",
  "HyperX", "Corsair", "Neolution E-sport", "Keychron", "Zowie"
];

export const typeList = [
  "Headphone", "Mouse", "Keyboard", "Streaming", "Table&Chair"
];

export const subTypeMap: Record<string, string[]> = {
  "Headphone": ["TrueWireless", "Wireless", "Fullsize", "InEar", "Earbud", "SoundCard", "Accessory"],
  "Mouse": ["Mouse", "Mousepad", "Accessory"],
  "Keyboard": ["RubberDome", "Mechanical", "WristRest"],
  "Streaming": ["Webcam", "Microphone", "Accessory"],
  "Table&Chair": ["Table", "Chair"]
};
