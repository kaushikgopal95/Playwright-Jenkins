function initForms() {
    const registrationForm = document.getElementById('registration-form');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const dob = document.getElementById('dob').value;
            const country = document.getElementById('country').value;
            
            // Get selected gender
            let gender = '';
            const genderRadios = document.querySelectorAll('input[name="gender"]');
            genderRadios.forEach(radio => {
                if (radio.checked) {
                    gender = radio.value;
                }
            });
            
            // Get selected interests
            const interests = [];
            const interestCheckboxes = document.querySelectorAll('input[name="interests"]');
            interestCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    interests.push(checkbox.value);
                }
            });
            
            const bio = document.getElementById('bio').value;
            const terms = document.getElementById('terms').checked;
            
            // Basic validation
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            if (!terms) {
                alert('You must agree to the terms and conditions');
                return;
            }
            
            // Create data object for API
            const userData = {
                username,
                email,
                password,
                dob,
                country,
                gender,
                interests,
                bio,
                terms
            };
            
            // Send data to API
            fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('API Response:', data);
                
                const successMessage = document.getElementById('successMessage');
                if (successMessage) {
                    if (data.success) {
                        successMessage.textContent = 'Registration successful!';
                        successMessage.style.color = 'green';
                        successMessage.style.padding = '10px';
                        successMessage.style.border = '1px solid green';
                        registrationForm.reset();
                    } else {
                        successMessage.textContent = data.message || 'Registration failed!';
                        successMessage.style.color = 'red';
                        successMessage.style.padding = '10px';
                        successMessage.style.border = '1px solid red';
                    }
                    
                    setTimeout(function() {
                        successMessage.textContent = '';
                        successMessage.style.color = '';
                        successMessage.style.padding = '';
                        successMessage.style.border = '';
                    }, 3000);
                }
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                alert('Error submitting form. Please try again.');
            });
        });
    }
}

// Initialize forms when DOM is loaded
document.addEventListener('DOMContentLoaded', initForms);
