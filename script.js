// Load persistent settings
window.onload = function () {
  const savedKey = localStorage.getItem("lastUsedKey");
  const savedMode = localStorage.getItem("lastUsedMode");
  if (savedKey) document.getElementById("keyInput").value = savedKey;
  if (savedMode) {
    document.getElementById(savedMode === "encrypt" ? "modeEncrypt" : "modeDecrypt").checked = true;
  }
};

// Drag-and-Drop File Upload
const dragDropZone = document.getElementById("dragDropZone");
const fileInput = document.getElementById("fileInput");

dragDropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dragDropZone.classList.add("drag-over");
});

dragDropZone.addEventListener("dragleave", () => {
  dragDropZone.classList.remove("drag-over");
});

dragDropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  dragDropZone.classList.remove("drag-over");

  const files = event.dataTransfer.files;
  if (files.length > 0) {
    fileInput.files = files;
    processFile(files[0]);
  }
});

document.getElementById("uploadTrigger").addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (event) => {
  const files = event.target.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
});

// Process the file
function processFile(file) {
  const keyInput = document.getElementById("keyInput");
  const modeEncrypt = document.getElementById("modeEncrypt").checked;
  const outputMessage = document.getElementById("outputMessage");
  const downloadLink = document.getElementById("downloadLink");
  const preview = document.getElementById("preview");
  const progressBarContainer = document.getElementById("progressBarContainer");
  const progressBar = document.getElementById("progressBar");

  // Reset output section
  outputMessage.textContent = "";
  downloadLink.style.display = "none";
  preview.textContent = "";
  progressBarContainer.style.display = "none";

  const key = parseInt(keyInput.value, 10);
  if (isNaN(key) || key < 1) {
    outputMessage.textContent = "Please enter a valid positive key.";
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    const text = e.target.result;
    const textLength = text.length;

    // Show progress bar
    progressBarContainer.style.display = "block";
    progressBar.style.width = "0%";

    // Process text
    let processedText = "";
    for (let i = 0; i < textLength; i++) {
      processedText += modeEncrypt
        ? encryptCaesarCipher(text[i], key)
        : decryptCaesarCipher(text[i], key);

      // Update progress bar
      if (i % 100 === 0) {
        progressBar.style.width = ((i / textLength) * 100).toFixed(1) + "%";
      }
    }

    progressBar.style.width = "100%";

    // Show preview of the processed text
    preview.textContent = processedText.slice(0, 500) + (processedText.length > 500 ? "\n... (truncated)" : "");

    // Create a blob for the processed text
    const blob = new Blob([processedText], { type: getMimeType(file.name) });
    const url = URL.createObjectURL(blob);

    // Set up download link
    downloadLink.href = url;
    downloadLink.download = (modeEncrypt ? "encrypted_" : "decrypted_") + file.name;
    downloadLink.textContent = "Download Processed File";
    downloadLink.style.display = "inline-block";
    outputMessage.textContent = "File processed successfully!";
  };

  reader.readAsText(file);
}

// Generate a random key
document.getElementById("generateKeyBtn").addEventListener("click", function () {
  const randomKey = Math.floor(Math.random() * 25) + 1;
  document.getElementById("keyInput").value = randomKey;
});

// Caesar Cipher Logic
function encryptCaesarCipher(char, key) {
  key %= 26;
  if (char >= "A" && char <= "Z") {
    return String.fromCharCode(((char.charCodeAt(0) - 65 + key) % 26) + 65);
  } else if (char >= "a" && char <= "z") {
    return String.fromCharCode(((char.charCodeAt(0) - 97 + key) % 26) + 97);
  } else {
    return char;
  }
}

function decryptCaesarCipher(char, key) {
  key %= 26;
  if (char >= "A" && char <= "Z") {
    return String.fromCharCode(((char.charCodeAt(0) - 65 - key + 26) % 26) + 65);
  } else if (char >= "a" && char <= "z") {
    return String.fromCharCode(((char.charCodeAt(0) - 97 - key + 26) % 26) + 97);
  } else {
    return char;
  }
}

// Get MIME type
function getMimeType(filename) {
  const extension = filename.split(".").pop().toLowerCase();
  switch (extension) {
    case "csv":
      return "text/csv";
    case "json":
      return "application/json";
    case "html":
      return "text/html";
    case "md":
      return "text/markdown";
    case "xml":
      return "application/xml";
    case "txt":
    default:
      return "text/plain";
  }
}
