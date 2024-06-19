document.addEventListener("DOMContentLoaded", function() {
    const textContent = document.querySelector(".text");
    const logo = document.querySelector(".splash_logo img");
    const yesButton = document.querySelector(".yes-button");
    const noButton = document.querySelector(".no-button");
  
    // Function to show the text content and hide the logo
    function showText() {
      textContent.classList.add("show");
      logo.style.display = "none";
    }
  
    // Add event listener to the "Yes" button
    yesButton.addEventListener("click", function() {
      // Redirect to vendor-auth.html
      window.location.href = "/authentication/vendor-auth.html";
    });
  
    // Add event listener to the "No" button
    noButton.addEventListener("click", function() {
      // Redirect to user-auth.html
      window.location.href = "/authentication/user-auth.html";
    });
  
    // Call the function to show the text after a certain delay (in milliseconds)
    setTimeout(showText, 5000); // Adjust the delay as needed
  });
  