firebase.initializeApp(config);

// As httpOnly cookies are to be used, do not persist any state client side.
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

const scriptQuery = new URLSearchParams(new URL(document.currentScript.src).search);

// FirebaseUI config.
const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '<url-to-redirect-to-on-success>',
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      customParameters: {
          // Forces account selection even when one account
          // is available.
          prompt: 'select_account'
        }
    },
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    },
  ],

  // Terms of service url/callback.
  tosUrl: '/legal/terms-of-service',
  // Privacy policy url/callback.
  privacyPolicyUrl: '/legal/privacy-policy',

  callbacks: {
    signInSuccessWithAuthResult: (authResult, redirectUrl) => { 
      // User successfully signed in.
      const user = authResult.user;
      const credential = authResult.credential;
      const isNewUser = authResult.additionalUserInfo.isNewUser;
      const providerId = authResult.additionalUserInfo.providerId;
      const operationType = authResult.operationType;
	
      user.getIdToken().then(function(idToken) {
        let params = (new URL(document.location)).searchParams;
        const inviteToken = params.get("invite");
        let redirect = '/sessionLogin?idToken=' + idToken;
        redirect += '&invite=' + inviteToken;
        window.location.href = redirect;
      }).catch(error => {
        alert(error);
      }) 
    }
  }
};

// Initialize the FirebaseUI Widget using Firebase.
const ui = new firebaseui.auth.AuthUI(firebase.auth());

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);
