const imageUploadInput = document.getElementById("image-upload");
const imagePreviewContainer = document.getElementById("image-preview");
const colorPickerInput = document.getElementById("color-picker");
const noImageSelectedPara = document.getElementById("no-image-selected");
const colorWheel = document.getElementById("color-wheel");
const colorDot = document.getElementById("color-dot");
const selectedColorElement = document.getElementById("selected-color");
const imagePreviewDiv = document.getElementById("image-preview");
const copyColorBtn = document.getElementById("copy-color-btn");
imageUploadInput.addEventListener("change", () => {
  if (imageUploadInput.files.length > 0) {
    noImageSelectedPara.style.display = "none";
  } else {
    noImageSelectedPara.style.display = "block";
  }
});
const selectedColorDiv = document.getElementById("selected-color");
const flexDiv = document.querySelector(".flex");

imageUploadInput.addEventListener("change", () => {
  if (imageUploadInput.files.length > 0) {
    flexDiv.classList.remove("hide");
  } else {
    flexDiv.classList.add("hide");
  }
});
let img;
let canvas;
let ctx;
imageUploadInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    imagePreviewContainer.style.backgroundImage = `url(${reader.result})`;
    colorWheel.style.backgroundImage = `url(${reader.result})`;
  });
  reader.readAsDataURL(file);
});

colorWheel.addEventListener("mousemove", (e) => {
  const x = e.offsetX;
  const y = e.offsetY;

  colorDot.style.left = `${x}px`;
  colorDot.style.top = `${y}px`;

  const imageData = getImageData(imagePreviewContainer, x, y);
  const rgb = getRgbFromImageData(imageData);

  colorPickerInput.value = rgbToHex(rgb);
  selectedColorElement.innerText = `Selected color: ${rgbToHex(rgb)}`;
});

function getImageData(element, x, y) {
  const backgroundImage = element.style.backgroundImage;
  const imageUrl = backgroundImage.replace(/^url\("(.+)"\)$/, "$1");
  const img = new Image();
  img.src = imageUrl;
  const canvas = document.createElement("canvas");
  canvas.width = element.offsetWidth;
  canvas.height = element.offsetHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(x, y, 1, 1).data;
}

function getRgbFromImageData(imageData) {
  return [imageData[0], imageData[1], imageData[2]];
}

function rgbToHex(rgb) {
  return `#${((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2])
    .toString(16)
    .slice(1)}`;
}

copyColorBtn.addEventListener("click", () => {
  const colorValue = colorPickerInput.value;
  navigator.clipboard.writeText(colorValue);
  alert(`Copied: ${colorValue}`);
});
const rgbBtn = document.getElementById("rgb-btn");
const hexBtn = document.getElementById("hex-btn");
const hslBtn = document.getElementById("hsl-btn");
const cmykBtn = document.getElementById("cmyk-btn");

let selectedColor = "";

// Add event listeners to the format buttons
rgbBtn.addEventListener("click", () => {
  convertColorFormat("rgb");
});

hexBtn.addEventListener("click", () => {
  convertColorFormat("hex");
});

hslBtn.addEventListener("click", () => {
  convertColorFormat("hsl");
});

cmykBtn.addEventListener("click", () => {
  convertColorFormat("cmyk");
});

// Function to convert the color format
function convertColorFormat(format) {
  const colorInput = document.getElementById("color-picker");
  const selectedColorValue = colorInput.value;
  let convertedColor = "";

  switch (format) {
    case "rgb":
      convertedColor = rgbToRgb(getRgbFromHex(selectedColorValue));
      break;
    case "hex":
      convertedColor = selectedColorValue;
      break;
    case "hsl":
      convertedColor = rgbToHsl(getRgbFromHex(selectedColorValue));
      break;
    case "cmyk":
      convertedColor = rgbToCmyk(getRgbFromHex(selectedColorValue));
      break;
    default:
      console.error(`Unknown format: ${format}`);
  }

  selectedColorDiv.textContent = `Selected color: ${convertedColor}`;
  selectedColor = convertedColor;
}

// Helper functions to convert color formats
function rgbToRgb(rgb) {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function rgbToHex(rgb) {
  return `#${((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2])
    .toString(16)
    .slice(1)}`;
}

function getRgbFromHex(hex) {
  const hexValue = hex.replace(/^#/, "");
  const r = parseInt(hexValue.substring(0, 2), 16);
  const g = parseInt(hexValue.substring(2, 4), 16);
  const b = parseInt(hexValue.substring(4, 6), 16);
  return [r, g, b];
}

function rgbToHsl(rgb) {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const hsl = rgbToHslValues(r, g, b);
  return `hsl(${hsl.h}deg, ${hsl.s}%, ${hsl.l}%)`;
}

function rgbToCmyk(rgb) {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const cmyk = rgbToCmykValues(r, g, b);
  return `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
}

// Helper functions to convert RGB to HSL and CMYK
function rgbToHslValues(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h, s, l;

  if (delta === 0) {
    h = 0;
    s = 0;
    l = max;
  } else {
    const deltaRatio = delta / max;
    s = deltaRatio;
    l = (max + min) / 2;

    if (r === max) {
      h = (g - b) / delta;
    } else if (g === max) {
      h = 2 + (b - r) / delta;
    } else {
      h = 4 + (r - g) / delta;
    }

    h *= 60;
    if (h < 0) {
      h += 360;
    }
  }

  return { h, s, l };
}

function rgbToCmykValues(r, g, b) {
  const k = 1 - Math.max(r, g, b);
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);

  return { c, m, y, k };
}
