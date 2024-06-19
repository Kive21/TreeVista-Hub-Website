import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
// import dotenv from 'dotenv';

// TreeVista Hub Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDztSMTwCkZ4ZMIELGb5sym_Ej5iX2yCTg",
    authDomain: "treevista-database-133b4.firebaseapp.com",
    projectId: "treevista-database-133b4",
    storageBucket: "treevista-database-133b4.appspot.com",
    messagingSenderId: "347600749387",
    appId: "1:347600749387:web:1a09815a85556382751ece",
    measurementId: "G-QFET2PTN20"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// dotenv.config();


// Initialize Firestore and Storage
const db = getFirestore();
const storage = getStorage();


// Initialize Firebase Analytics
const analytics = getAnalytics(app);
const storageRef = ref(storage);


function sweetAlertWithRedirect(message, type, redirectUrl) {
    Swal.fire({
      title: type.charAt(0).toUpperCase() + type.slice(1),
      text: message,
      icon: type,
      confirmButtonText: 'OK'
    }).then(() => {
      // Wait for 2 seconds before redirecting
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000); // 2000 milliseconds = 2 seconds
    });
  }

// Function to show error SweetAlert with cancel option
const sweetAlertWithError = (title, message, formElement) => {
  Swal.fire({
    icon: 'error',
    title: title,
    text: message,
    confirmButtonText: 'OK',
    showCancelButton: true,
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      // If user confirms, redirect to the homepage
      window.location.href = '';
    } else {
      // If user cancels, reset the form
      formElement.reset();
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {

// Function to update user role in Firestore
async function updateUserRole(userId, role) {
  try {
    await setDoc(doc(db, 'user_roles', userId), { role });
    console.log('User role updated successfully');
  } catch (error) {
    console.error('Error updating user role:', error);
  }
}

// User Signup
const userSignupForm = document.getElementById('user-signup-form');
if (userSignupForm) {
  userSignupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = userSignupForm['signup-username'].value;
    const email = userSignupForm['signup-email'].value;
    const phone = userSignupForm['signup-phone'].value;
    const password = userSignupForm['signup-password'].value;
    const confirmPassword = userSignupForm['signup-confirm-password'].value;

    if (password !== confirmPassword) {
      sweetAlertWithError('Sign Up Error', 'Passwords do not match. Please try again.', userSignupForm);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        username: username,
        email: email,
        phone: phone,
        role: 'user' // Set user role
      });
      sweetAlertWithRedirect('You have successfully signed up as a user.', 'success', 'index.html');
    } catch (error) {
      console.error(error);
      sweetAlertWithError('Login Error', error.message, () => {
        // Redirect to user-auth.html only when OK is pressed
        window.location.href = '/authentication/user-auth.html';
      });
    }
  });
}

// User Login
const userLoginForm = document.getElementById('user-login-form');
if (userLoginForm) {
  userLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = userLoginForm['login-email'].value;
    const password = userLoginForm['login-password'].value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user is an admin
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      if (adminDoc.exists()) {
        // Admin login successful
        sweetAlertWithRedirect('Welcome back Admin ✨', 'success', '/index.html');
      } else {
        // User login, update user role
        await updateUserRole(user.uid, 'user');
        sweetAlertWithRedirect('You have successfully logged in as a user.', 'success', '/index.html');
      }
    } catch (error) {
      console.error(error);

      // Check if the error is due to the user profile not being found
      if (error.code === 'auth/user-not-found') {
        throw new Error('User profile not found');
      } else {
        sweetAlertWithError('Login Error', error.message, () => {
            // Redirect to vendor-auth.html only when OK is pressed
            window.location.href = '/authentication/user-auth.html';
          });
      }
    }
  });
}

// Forgot Password Functionality
const forgotPasswordLink = document.querySelector('.forgot-password');
forgotPasswordLink.addEventListener('click', async () => {
  const { value: email } = await Swal.fire({
    title: 'Enter your email address',
    input: 'email',
    inputLabel: 'Email',
    inputPlaceholder: 'Enter your email',
    showCancelButton: true,
  });

  if (email) {
    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire('Password Reset', 'We have sent you a password reset email. Please check your inbox.', 'success');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      Swal.fire('Error', 'Failed to send password reset email. Please try again.', 'error');
    }
  }
});

// Vendor Signup
const vendorSignupForm = document.getElementById('vendor-signup-form');
if (vendorSignupForm) {
  vendorSignupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const vendorname = vendorSignupForm['signup-vendorname'].value;
    const email = vendorSignupForm['signup-email'].value;
    const phone = vendorSignupForm['signup-phone'].value;
    const password = vendorSignupForm['signup-password'].value;
    const confirmPassword = vendorSignupForm['signup-confirm-password'].value;
    const logoFile = vendorSignupForm['signup-logo'].files[0];
    const location = vendorSignupForm['signup-location'].value;

    if (password !== confirmPassword) {
      sweetAlertWithError('Sign Up Error', 'Passwords do not match. Please try again.', vendorSignupForm);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Upload logo to Firestore Storage
      const logoRef = ref(storage, 'vendor_logos/' + logoFile.name);
      await uploadBytes(logoRef, logoFile);
      const logoURL = await getDownloadURL(logoRef);
      await setDoc(doc(db, 'vendors', user.uid), {
        vendorname: vendorname,
        email: email,
        phone: phone,
        logoURL: logoURL,
        location: location,
        role: 'vendor' // Set vendor role
      });
      sweetAlertWithRedirect('You have successfully signed up as a vendor.', 'success', '/vendors/vendor-dashboard.html');
    } catch (error) {
      console.error(error);
      sweetAlertWithError('Login Error', error.message, () => {
        // Redirect to vendor-auth.html only when OK is pressed
        window.location.href = '/authentication/vendor-auth.html';
      });
    }
  });
}

// Vendor Login
const vendorLoginForm = document.getElementById('vendor-login-form');
if (vendorLoginForm) {
  vendorLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = vendorLoginForm['login-email'].value;
    const password = vendorLoginForm['login-password'].value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user is an admin
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      if (adminDoc.exists()) {
        // Admin login successful
        sweetAlertWithRedirect('Welcome back Admin ✨', 'success', '/index.html');
      } else {
        // Check if the user is a vendor
        const vendorDoc = await getDoc(doc(db, 'vendors', user.uid));
        if (vendorDoc.exists()) {
          // Vendor login, update user role
          await updateUserRole(user.uid, 'vendor');
          sweetAlertWithRedirect('Welcome back ✨', 'success', '/vendors/vendor-dashboard.html');
        } else {
          // User is not a vendor
          throw new Error('User is not a vendor');
        }
      }
    } catch (error) {
      console.error(error);
      sweetAlertWithError('Login Error', error.message, () => {
        // Redirect to vendor-auth.html only when OK is pressed
        window.location.href = 'vendor-auth.html';
      });
    }
  });
}

// Admin Signup
const adminSignupForm = document.getElementById('admin-signup-form');
if (adminSignupForm) {
  adminSignupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = adminSignupForm['signup-username'].value;
    const email = adminSignupForm['signup-email'].value;
    const phone = adminSignupForm['signup-phone'].value;
    const password = adminSignupForm['signup-password'].value;
    const confirmPassword = adminSignupForm['signup-confirm-password'].value;

    if (password !== confirmPassword) {
      sweetAlertWithError('Sign Up Error', 'Passwords do not match. Please try again.', adminSignupForm);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'admins', user.uid), {
        username: username,
        email: email,
        phone: phone,
        role: 'admin' // Set admin role
      });
      sweetAlertWithRedirect('You have successfully signed up as an admin.', 'success', '/index.html');
    } catch (error) {
      console.error(error);
      sweetAlertWithError('Sign Up Error', error.message, adminSignupForm);
    }
  });
}

// Admin Login (through both vendor and user login forms)
const adminLoginForm = document.getElementById('vendor-login-form') || document.getElementById('user-login-form');
if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = adminLoginForm['login-email'].value;
    const password = adminLoginForm['login-password'].value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user is an admin
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      if (adminDoc.exists()) {
        // Admin login successful
        sweetAlertWithRedirect('Welcome back Admin ✨', 'success', 'index.html');
      } else {
        // Check if the user is a vendor
        const vendorDoc = await getDoc(doc(db, 'vendors', user.uid));
        if (vendorDoc.exists()) {
          // Vendor login, update user role
          await updateUserRole(user.uid, 'vendor');
          sweetAlertWithRedirect('Welcome back ✨', 'success', '/vendors/vendor-dashboard.html');
        } else {
          // Check if the user is a regular user
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            // User login, update user role
            await updateUserRole(user.uid, 'user');
            sweetAlertWithRedirect('You have successfully logged in as a user.', 'success', '/index.html');
          } else {
            // User is not an admin, vendor, or regular user
            throw new Error('User profile not found');
          }
        }
      }
    } catch (error) {
      console.error(error);
      sweetAlertWithError('Login Error', error.message, () => {
        // Redirect to vendor-auth.html only when OK is pressed
        window.location.href = '/authentication/vendor-auth.html';
      });
    }
  });
}


});


document.addEventListener('DOMContentLoaded', () => {
  // Check user authentication state and update navbar
  onAuthStateChanged(auth, (user) => {
      const navList = document.getElementById('auth-link');
      navList.innerHTML = ''; // Clear the existing content

      if (user) {
          // If user is signed in, display "Logout" list item
          const logoutListItem = document.createElement('li');
          logoutListItem.id = 'logout-list-item';
          const logoutLink = document.createElement('a');
          logoutLink.href = '#'; // Use '#' to prevent default navigation
          logoutLink.textContent = 'Logout';

          logoutLink.addEventListener('click', async (e) => {
              e.preventDefault();
              Swal.fire({
                  icon: 'warning',
                  title: 'Do you want to sign out?',
                  showCancelButton: true,
                  confirmButtonText: 'Sign out',
                  cancelButtonText: 'Cancel'
              }).then(async (result) => {
                  if (result.isConfirmed) {
                      try {
                          await signOut(auth);
                          console.log('User signed out');
                          sweetAlertWithRedirect('You have successfully logged out.', 'info', 'index.html');
                      } catch (error) {
                          console.error('Error signing out:', error);
                          sweetAlertWithRedirect('Log out failed. Please try again.', 'error', 'index.html');
                      }
                  }
              });
          });

          logoutListItem.appendChild(logoutLink);
          navList.appendChild(logoutListItem);
      } else {
          // If user is not signed in, display "Sign In" list item
          const signInListItem = document.createElement('li');
          signInListItem.id = 'signin-list-item';
          const signInLink = document.createElement('a');
          signInLink.href = 'splashscreen.html'; // Update with sign-in page URL
          signInLink.textContent = 'Sign In';

          signInListItem.appendChild(signInLink);
          navList.appendChild(signInListItem);
      }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Check user authentication state and update navbar
  onAuthStateChanged(auth, (user) => {
      const navList = document.getElementById('vendor-login');
      navList.innerHTML = ''; // Clear the existing content

      if (user) {
          // If user is signed in, display "Logout" list item
          const logoutListItem = document.createElement('li');
          logoutListItem.id = 'logout-list-item';
          const logoutLink = document.createElement('a');
          logoutLink.href = '#'; // Use '#' to prevent default navigation
          logoutLink.textContent = 'Logout';

          logoutLink.addEventListener('click', async (e) => {
              e.preventDefault();
              Swal.fire({
                  icon: 'warning',
                  title: 'Do you want to sign out?',
                  showCancelButton: true,
                  confirmButtonText: 'Sign out',
                  cancelButtonText: 'Cancel'
              }).then(async (result) => {
                  if (result.isConfirmed) {
                      try {
                          await signOut(auth);
                          console.log('User signed out');
                          sweetAlertWithRedirect('You have successfully logged out.', 'info', '/vendors/vendor-dashboard.html');
                      } catch (error) {
                          console.error('Error signing out:', error);
                          sweetAlertWithRedirect('Log out failed. Please try again.', 'error', '/vendors/vendor-dashboard.html');
                      }
                  }
              });
          });

          logoutListItem.appendChild(logoutLink);
          navList.appendChild(logoutListItem);
      } else {
          // If user is not signed in, display "Sign In" list item
          const signInListItem = document.createElement('li');
          signInListItem.id = 'signin-list-item';
          const signInLink = document.createElement('a');
          signInLink.href = 'splashscreen.html'; // Update with sign-in page URL
          signInLink.textContent = 'Sign In';

          signInListItem.appendChild(signInLink);
          navList.appendChild(signInListItem);
      }
  });
});


