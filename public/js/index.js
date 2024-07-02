import "@babel/polyfill";
import { login, logout } from "./login";
import { displayMap } from "./leaflet";
import { updateSettings } from "./updateSettings";
import { bookTour } from "./stripe";
import { showAlert } from "./alerts";

// DOM ELEMENTS
const map = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logoutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const bookBtn = document.getElementById("book-tour");
const alertMessage = document.querySelector("body").dataset.alert;

// Display the map if it exists
if (map) {
  const locations = JSON.parse(map.dataset.locations);
  displayMap(locations);
}

// Login functionality
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

// Logout functionality
if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

// Updating user name and email
if (userDataForm) {
  userDataForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);

    updateSettings(form, "data");
  });
}

// Updating user password
if (userPasswordForm) {
  userPasswordForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating....";

    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;

    await updateSettings({ passwordCurrent, password, passwordConfirm }, "password");

    document.querySelector(".btn--save-password").textContent = "Save password";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
}

if (bookBtn) {
  bookBtn.addEventListener("click", function (e) {
    e.target.textContent = "Processing....";
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

if (alert) showAlert("success", alertMessage, 15);
