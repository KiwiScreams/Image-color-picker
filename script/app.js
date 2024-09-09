const imageUploadInput = document.getElementById("image-upload");
const imagePreviewContainer = document.getElementById("image-preview");
const colorPickerInput = document.getElementById("color-picker");
imageUploadInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    imagePreviewContainer.style.backgroundImage = `url(${reader.result})`;
  });
  reader.readAsDataURL(file);
});
colorPickerInput.addEventListener("input", (e) => {
  const color = e.target.value;
  imagePreviewContainer.style.filter = `hue-rotate(${color})`;
});
const colorWheel = document.getElementById("color-wheel");

colorWheel.addEventListener("click", (e) => {
  const x = e.clientX - colorWheel.offsetLeft;
  const y = e.clientY - colorWheel.offsetTop;

  const hue =
    (Math.atan2(
      y - colorWheel.offsetHeight / 2,
      x - colorWheel.offsetWidth / 2
    ) *
      180) /
    Math.PI;

  const saturation =
    Math.sqrt(
      Math.pow(x - colorWheel.offsetWidth / 2, 2) +
        Math.pow(y - colorWheel.offsetHeight / 2, 2)
    ) /
    (colorWheel.offsetWidth / 2);

  const lightness = 1 - y / colorWheel.offsetHeight;

  const rgb = hslToRgb(hue, saturation, lightness);

  colorPickerInput.value = rgbToHex(rgb);

  imagePreviewContainer.style.filter = `hue-rotate(${rgbToHex(rgb)})`;
});

function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHex(rgb) {
  return `#${((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2])
    .toString(16)
    .slice(1)}`;
}
