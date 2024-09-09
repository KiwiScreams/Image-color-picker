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
