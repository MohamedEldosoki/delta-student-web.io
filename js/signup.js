// Function to check if the user is logged in (replace with your actual logic)
function checkIfUserIsLoggedIn() {
    // This is a placeholder, replace with your authentication check
    // Example: Check for a session variable, cookie, or local storage value
    // Return true if logged in, false otherwise
    return false; 
}

// Hide the Sign Up link if the user is logged in
const signUpLink = document.querySelector('.btn-primary'); 
if (checkIfUserIsLoggedIn()) {
    signUpLink.style.display = 'none';
}

const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
    event.preventDefault(); 

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const termsCheckbox = document.getElementById('terms');

    if (username === '' || email === '' || password === '') {
        alert('Please fill in all fields.');
        return;
    }

    if (!termsCheckbox.checked) {
        alert('Please agree to the Terms and Conditions.');
        return;
    }

    // If validation passes, you can submit the form data to your backend here
    // Example:
    // form.submit(); 

    // Or, you can use AJAX to send the data asynchronously
    // Example:
    // sendFormDataToBackend(username, email, password); 

    alert('Sign up successful!'); // Placeholder success message
});

// Feather Icons (if you're using Feather Icons)
feather.replace();