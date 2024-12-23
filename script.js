// Load persistent settings
window.onload = function () {
  const savedKey = localStorage.getItem("lastUsedKey");
  const savedMode = localStorage.getItem("lastUsedMode");
  if (savedKey) document.getElementById("keyInput").value = savedKey;
  if (savedMode) {
    document.getElementById(
      savedMode === "encrypt" ? "modeEncrypt" : "modeDecrypt"
    ).checked = true;
  }
};

document.getElementById("processBtn").addEventListener("click", function () {
  const fileInput = document.getElementById("fileInput");
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

  if (!fileInput.files[0]) {
    outputMessage.textContent = "Please select a file.";
    return;
  }

  const key = parseInt(keyInput.value, 10);
  if (isNaN(key) || key < 1) {
    outputMessage.textContent = "Please enter a valid positive key.";
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const text = e.target.result;
    const textLength = text.length;

    // Show progress bar
    progressBarContainer.style.display = "block";
    progressBar.style.width = "0%";

    // Process text with progress
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
    preview.textContent =
      processedText.slice(0, 500) +
      (processedText.length > 500 ? "\n... (truncated)" : "");

    // Create a blob for the processed text
    const blob = new Blob([processedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    // Set up download link
    downloadLink.href = url;
    downloadLink.download =
      (modeEncrypt ? "encrypted_" : "decrypted_") + file.name;
    downloadLink.textContent = "Download Processed File";
    downloadLink.style.display = "inline-block";
    outputMessage.textContent = "File processed successfully!";

    // Save settings
    localStorage.setItem("lastUsedKey", key);
    localStorage.setItem("lastUsedMode", modeEncrypt ? "encrypt" : "decrypt");
  };

  reader.readAsText(file);
});

document
  .getElementById("generateKeyBtn")
  .addEventListener("click", function () {
    const randomKey = Math.floor(Math.random() * 25) + 1; // Generate random key between 1 and 25
    document.getElementById("keyInput").value = randomKey;
  });

function encryptCaesarCipher(char, key) {
  key %= 26;
  if (char >= "A" && char <= "Z") {
    return String.fromCharCode(((char.charCodeAt(0) - 65 + key) % 26) + 65);
  } else if (char >= "a" && char <= "z") {
    return String.fromCharCode(((char.charCodeAt(0) - 97 + key) % 26) + 97);
  } else {
    return char; // Leave non-alphabetic characters unchanged
  }
}

function decryptCaesarCipher(char, key) {
  key %= 26;
  if (char >= "A" && char <= "Z") {
    return String.fromCharCode(
      ((char.charCodeAt(0) - 65 - key + 26) % 26) + 65
    );
  } else if (char >= "a" && char <= "z") {
    return String.fromCharCode(
      ((char.charCodeAt(0) - 97 - key + 26) % 26) + 97
    );
  } else {
    return char; // Leave non-alphabetic characters unchanged
  }
}
