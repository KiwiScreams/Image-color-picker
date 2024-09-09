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
