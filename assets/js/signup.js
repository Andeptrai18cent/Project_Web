// script.js
document.getElementById("form").addEventListener("submit", async function (e) {
  e.preventDefault(); // Prevent the form from reloading the page

  const form = e.target;
  const formData = new FormData(form);

  // Convert FormData to JSON
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("http://localhost:8080/authen-new-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data) // Send data as JSON
    });

    const result = await response.json();
    if (result.status == 200) {
      alert("Tạo tài khoản thành công");
      window.location.href = "http://localhost:8080/";
    } else {
      const err_message = result.message
    if (err_message.includes("username"))
      {
        alert("Tên người dùng phải có từ 6 ký tự trở lên")
      }
    else if (err_message.includes("address"))
      {
        alert("Địa chỉ phải có từ 6 ký tự trở lên")
      }
    else if (err_message.includes("name"))
      {
        alert("Tên phải có từ 6 ký tự trở lên")
      }
    else if (err_message.includes("phone"))
      {
        alert("Số điện thoại không hợp lệ")
      }
    else if (err_message.includes("thử email"))
    {
        alert("Email đã tồn tại, vui lòng chọn email khác")
    }
    else if (err_message.includes("email"))
      {
        alert("Email không hợp lệ")
      }
    else if (err_message.includes("repeat_password"))
      {
        alert("Hai mật khẩu không giống nhau")
      }
    else if (err_message.includes("password"))
      {
        alert("Mật khẩu không hợp lệ")
      }
    else
        alert(err_message)
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Request failed");
  }
});
