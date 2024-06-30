import axios from "axios";
import { showAlert } from "./alerts";

const stripe = Stripe(
  "pk_test_51PWEZHRugqzagtpj36uZjpr54pZoK29ttRiI0REyI9NFzAYh17ejAOFLs2SJ2lMoiMEkgGjDR7nv9nUQQzkl9pYL00y2YxRKAx",
);

export const bookTour = async function (tourId) {
  try {
    // 1) Get checkout session from API
    const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert("error", err);
  }
};
