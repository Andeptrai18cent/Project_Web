document.getElementById("form").addEventListener("submit", async function (e) {
  e.preventDefault(); // Prevent the form from reloading the page
  console.log("Working Properly")
  const form = e.target;
  const formData = new FormData(form);

  // Convert FormData to JSON
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("http://localhost:8080/check-user-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data) // Send data as JSON
    });

    const result = await response.json();
    if (result.status == 200) {
      alert("Đăng nhập thành công");
      window.location.href = "http://localhost:8080/";
    }
    else
        alert("Sai tên đăng nhập hoặc mật khẩu")
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Request failed");
  }
});
