document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tooltip = document.getElementById('info-tooltip');

    navButtons.forEach(button => {
        button.addEventListener('mouseover', (e) => {
            const info = e.target.getAttribute('data-info');
            tooltip.textContent = info;
            tooltip.style.display = 'block';
            tooltip.style.left = `${e.target.getBoundingClientRect().left + window.scrollX}px`;
            tooltip.style.top = `${e.target.getBoundingClientRect().bottom + window.scrollY + 10}px`;
        });

        button.addEventListener('mouseout', () => {
            tooltip.style.display = 'none';
        });
    });

    // Handle login form submission
    const loginForm = document.querySelector('#loginModal form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the form from submitting the traditional way

            // Get input values
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            // Simple validation (optional)
            if (email && password) {
                // Retrieve stored user data
                const storedUserData = JSON.parse(localStorage.getItem('userData'));

                // Validate against stored data
                if (storedUserData && storedUserData.email === email && storedUserData.password === password) {
                    // Redirect to index2.html on successful login
                    window.location.href = 'index2.html'; // Ensure this file exists
                } else {
                    alert('Invalid email or password.'); // Error message
                }
            } else {
                alert('Please enter both email and password.'); // Error message
            }
        });
    }

    // Handle sign-up form submission
    const signUpForm = document.querySelector('#signUpModal form');
    if (signUpForm) {
        signUpForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the form from submitting the traditional way

            // Get input values
            const username = document.getElementById('signup-username').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            // Validate registration data
            if (username && email && password) {
                // Store user data in local storage
                const userData = { username: username, email: email, password: password };
                localStorage.setItem('userData', JSON.stringify(userData));

                alert('Registration successful! You can now log in.'); // Inform the user
                closeSignUpModal(); // Close the sign-up modal
            } else {
                alert('Please fill in all fields.'); // Error message
            }
        });
    }
});

function openLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function openSignUpModal() {
    document.getElementById('signUpModal').style.display = 'flex';
}

function closeSignUpModal() {
    document.getElementById('signUpModal').style.display = 'none';
}

// Loading animation logic
setTimeout(() => {
    // Fade out the loading animation
    document.getElementById('loading').style.opacity = '0';

    // After the loading animation is faded out, display the main content
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none'; // Completely hide loading animation
        document.getElementById('main-content').style.opacity = '1'; // Fade in the main content
        document.body.style.overflow = 'auto'; // Allow scrolling
    }, 1000); // Wait for the fade-out transition to complete (1 second)
}, 3000);
