const form = document.getElementById('uploadForm');
const titleInput = document.getElementById('title');
const qualitySelect = document.getElementById('quality');
const dateInput = document.getElementById('publishDate');
const videoFileInput = document.getElementById('videoFile');
const thumbFileInput = document.getElementById('thumbFile');
const videoZone = document.querySelector('.video-zone');
const thumbZone = document.querySelector('.thumb-zone');

// Change select text colour to black once an option is picked
qualitySelect.addEventListener('change', () => {
  qualitySelect.classList.toggle('has-value', qualitySelect.value !== '');
});

// When a video file is chosen: show a <video> preview inside the upload zone
videoFileInput.addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  const inner = videoZone.querySelector('.upload-zone-inner');
  inner.innerHTML = '';
  const vid = document.createElement('video');
  vid.src = url;
  vid.controls = true;
  inner.appendChild(vid);
  clearError('videoError', videoZone);
});

// When a thumbnail image is chosen: show an <img> preview inside the upload zone
thumbFileInput.addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  const inner = thumbZone.querySelector('.upload-zone-inner');
  inner.innerHTML = '';
  const img = document.createElement('img');
  img.src = url;
  inner.appendChild(img);
});

// Add red border + "Required field" text below a field
function showError(inputEl, zoneEl, errorId, msg) {
  if (inputEl) inputEl.classList.add('invalid');
  if (zoneEl) zoneEl.classList.add('invalid');
  document.getElementById(errorId).textContent = msg;
}

// Remove red border and clear error text
function clearError(errorId, el) {
  if (el) el.classList.remove('invalid');
  document.getElementById(errorId).textContent = '';
}

// Clear errors as the user types / picks a value
titleInput.addEventListener('input', () => {
  if (titleInput.value.trim()) clearError('titleError', titleInput);
});
qualitySelect.addEventListener('change', () => {
  if (qualitySelect.value) clearError('qualityError', qualitySelect);
});
dateInput.addEventListener('change', () => {
  if (dateInput.value) clearError('dateError', dateInput);
});
videoFileInput.addEventListener('change', () => {
  if (videoFileInput.files.length) clearError('videoError', videoZone);
});

// Validate all required fields before the form submits
form.addEventListener('submit', function (e) {
  let valid = true;

  // Title is required
  if (!titleInput.value.trim()) {
    showError(titleInput, null, 'titleError', 'Required field');
    valid = false;
  } else {
    clearError('titleError', titleInput);
  }

  // Quality dropdown is required
  if (!qualitySelect.value) {
    showError(qualitySelect, null, 'qualityError', 'Required field');
    valid = false;
  } else {
    clearError('qualityError', qualitySelect);
  }

  // Publish date is required
  if (!dateInput.value) {
    showError(dateInput, null, 'dateError', 'Required field');
    valid = false;
  } else {
    clearError('dateError', dateInput);
  }

  // Video file is required
  if (!videoFileInput.files.length) {
    showError(null, videoZone, 'videoError', 'Required field');
    valid = false;
  } else {
    clearError('videoError', videoZone);
  }

  // Stop form submission if any field is invalid
  if (!valid) e.preventDefault();
});