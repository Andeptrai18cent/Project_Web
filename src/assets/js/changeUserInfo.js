const newPasswordInput = document.getElementById('new_password');
const repeatPasswordInput = document.getElementById('repeat_new_password');
const submitBtn = document.getElementById('submit-btn');
const passwordError = document.getElementById('password-error');
const repeatError = document.getElementById('repeat-error');
const repeatSuccess = document.getElementById('repeat-success');
const passwordStrength = document.getElementById('password-strength');
const strengthFill = document.getElementById('strength-fill');
const strengthText = document.getElementById('strength-text');
const form = document.getElementById('changePasswordForm');
form.addEventListener("submit", async function (e) {
  e.preventDefault(); // Prevent the form from reloading the page
  console.log("Working Properly")
  const form_element = e.target;
  const formData = new FormData(form_element);

  // Convert FormData to JSON
  const data = Object.fromEntries(formData.entries());
   const response = await fetch('http://localhost:8080/user-info-change', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.error) {
            // If there was an error, alert the error message
            alert(`Có lỗi xảy ra: ${result.message}`);
        } else {
            // If successful, alert success message and redirect
            alert('Cập nhật thông tin thành công');
            window.location.href = 'http://localhost:8080/';
        }
})