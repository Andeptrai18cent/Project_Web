document.addEventListener("DOMContentLoaded", () => {
    // Toggle Menu
    const toggle = document.querySelector(".toggle");
    const navigation = document.querySelector(".navigation");
    const main = document.querySelector(".main");

    toggle.onclick = function () {
        navigation.classList.toggle("active");
        main.classList.toggle("active");
    };

//     // Navigation Active State
//     const links = document.querySelectorAll(".navigation a[data-section]");
//     const contents = document.querySelectorAll(".content");

//     // Mặc định hiển thị Task-Manager
//     links.forEach((link) => {
//         link.addEventListener("click", (e) => {
//             e.preventDefault();

//             // Loại bỏ class active khỏi tất cả các liên kết
//             links.forEach((l) => l.classList.remove("active"));
//             link.classList.add("active");

//             // Lấy section từ thuộc tính data-section
//             const section = link.getAttribute("data-section");

//             // Hiển thị nội dung tương ứng và ẩn các phần khác
//             contents.forEach((content) => {
//                 if (content.id === `${section}-content`) {
//                     content.classList.remove("hidden");
//                 } else {
//                     content.classList.add("hidden");
//                 }
//             });
//         });
//     });

//     // Đảm bảo khi bấm Task-Manager lần nữa vẫn hiển thị
//     // Add hover effect to selected list item
//     const listItems = document.querySelectorAll(".navigation li");
//     function activeLink() {
//         listItems.forEach((item) => item.classList.remove("hovered"));
//         this.classList.add("hovered");
//     }
//     listItems.forEach((item) => item.addEventListener("mouseover", activeLink));
});
