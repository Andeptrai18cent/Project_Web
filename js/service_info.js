function directPage(){
    window.location.href = "/book_tasker/step_1.html";
    console.log("Hello");
}

const button = document.querySelector("#book-tasker-button");
console.log(button)
button.setAttribute("onclick", "directPage()");
