// Get the modal
let instructionsModal = document.getElementById("instructions-modal");

let instructionsButton = document.getElementById("instructions");

// Get the <span> element that closes the modal
let instructionsCloser = document.getElementById("instructions-modal-close");

instructionsButton.onclick = function () {
  instructionsModal.style.display = "block";
};

instructionsCloser.onclick = function () {
  instructionsModal.style.display = "none";
};
