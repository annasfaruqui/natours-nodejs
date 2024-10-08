import axios from "axios";
import { showAlert } from "./alerts";

export const login = async function (email, password) {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: { email, password },
    });

    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully");
      window.setTimeout(function () {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const logout = async function () {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/logout",
    });

    if (res.data.status === "success") {
      showAlert("success", "Logged out successfully");
      window.setTimeout(function () {
        location.reload(true);
      }, 1000);
    }
  } catch (err) {
    console.log(err.response.data);
    showAlert("error", "Error logging out! Try again.");
  }
};
