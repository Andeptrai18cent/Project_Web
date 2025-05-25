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
  const newPassword = newPasswordInput.value
  const repeatPassword = repeatPasswordInput.value
  console.log(`${newPassword}\n${repeatPassword}`)
  if (newPassword != repeatPassword)
  {
    alert("Hai mật khẩu không trùng nhau")
    return
  }
   const response = await fetch('http://localhost:8080/change-user-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                new_password: newPassword,
                repeat_new_password: repeatPassword
            })
        });

        const result = await response.json();

        if (result.error) {
            // If there was an error, alert the error message
            alert(`Có lỗi xảy ra: ${result.message}`);
        } else {
            // If successful, alert success message and redirect
            alert('Thay đổi mật khẩu thành công');
            window.location.href = 'http://localhost:8080/';
        }
})