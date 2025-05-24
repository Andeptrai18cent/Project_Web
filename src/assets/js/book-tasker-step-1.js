console.log(document.getElementById("form"))
document.getElementById("form").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent the form from reloading the page
    const service_id = document.getElementById("form").className
    const form = e.target;
    const formData = new FormData(form);
    console.log("Working properly")
    const data = Object.fromEntries(formData.entries());

    const response = await fetch(`http://localhost:8080/order-task/step1_finish/${service_id}`,
        {
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
    )
    window.location.href = "http://localhost:8080/order-task/step2";
}
)