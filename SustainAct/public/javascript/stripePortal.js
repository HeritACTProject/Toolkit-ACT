// Initialize Firebase
const config = {
  apiKey: "AIzaSyAnzf4J4P2_SJYvNdY_yqcltZeQwOcA9_4",
  authDomain: "sdg-tag-tool.firebaseapp.com",
  projectId: "sdg-tag-tool",
  storageBucket: "sdg-tag-tool.appspot.com",
  messagingSenderId: "648805994872",
  appId: "1:648805994872:web:10221479cc66f13be1b88d"
};
firebase.initializeApp(config);

// As httpOnly cookies are to be used, do not persist any state client side.
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

const test = async () => {
  const functionRef = firebase
    .app()
    .functions('europe-west1')
    .httpsCallable('ext-firestore-stripe-subscriptions-createPortalLink');
  const { data } = await functionRef({
    returnUrl: window.location.origin,
    locale: "auto", // Optional, defaults to "auto"
    configuration: "bpc_1JSEAKHYgolSBA358VNoc2Hs", // Optional ID of a portal configuration: https://stripe.com/docs/api/customer_portal/configuration
  });
  window.location.assign(data.url);
}

test();
