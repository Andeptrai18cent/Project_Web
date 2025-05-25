const user_link_dropdown = document.querySelector("#myDropdown")

const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');

document.addEventListener('DOMContentLoaded', () => {
  getToken();
  initCategoryTabs();
});

const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

ScrollReveal().reveal(".header__content h1", {
  ...scrollRevealOption,
});
ScrollReveal().reveal(".header form", {
  ...scrollRevealOption,
    delay: 500,
});

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

async function getToken(){
  const response = await fetch("http://localhost:8080/token-check", {
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  },
  });

  const result = await response.json()
  if (result.user_id)
  {
    document.getElementById("Login_Link").style.display = "none"
    document.getElementById("Sign_up_Link").style.display = "none"
    if (result.tasker_id)
    {
      const user_link_dropdown = document.querySelector("#myDropdown").querySelectorAll("a")
      user_link_dropdown[3].href="/tasker/task-list"
      document.getElementById("Become_Tasker").style.display = "none"
    }
  }
  else
  {
    document.getElementById("user_dropdown_only").style.display = "none"
  }
}

// Xử lý chức năng hiển thị danh mục
function initCategoryTabs() {
    // Lấy tất cả các card danh mục
    const categoryCards = document.querySelectorAll('.category__card');
    
    // Lấy tất cả các container hiển thị
    const displayContainers = document.querySelectorAll('.category__display__container');
    
    // Log để debug
    console.log('Tìm thấy ' + categoryCards.length + ' card danh mục');
    console.log('Tìm thấy ' + displayContainers.length + ' container hiển thị');
    
    // Đặt container đầu tiên là active mặc định (nếu có)
    if (displayContainers.length > 0) {
        // Ẩn tất cả container trước
        displayContainers.forEach(container => {
            container.style.display = 'none';
        });
        
        // Hiển thị container đầu tiên
        displayContainers[0].style.display = 'block';
    }
    
    // hàm xử lý sự kiện click cho mỗi card
     function handleCategoryClick(event) {
        // Kiểm tra xem có đang trong chế độ search không
        if (document.body.classList.contains('search-active')) {
            // Ngăn chặn sự kiện nếu đang search
            event.preventDefault();
            event.stopPropagation();
            console.log('Category click bị vô hiệu hóa vì đang search');
            return false;
        }
        
        // Lấy target từ thuộc tính data-target
        const target = this.getAttribute('data-target');
        console.log('Clicked on category with target: ' + target);
        
        // Ẩn tất cả các container
        displayContainers.forEach(container => {
            container.style.display = 'none';
            container.classList.remove('active');
        });
        
        // Hiển thị container được chọn
        const targetContainer = document.getElementById(target);
        if (targetContainer) {
            targetContainer.style.display = 'block';
            targetContainer.classList.add('active');
            
            // Log để debug
            console.log('Hiển thị container: ' + target);
        } else {
            console.error('Không tìm thấy container với ID: ' + target);
        }
    }
    
      // Thêm sự kiện click cho mỗi card
      categoryCards.forEach(card => {
            card.addEventListener('click', handleCategoryClick);
        });
        
      // Trả về đối tượng để có thể điều khiển từ bên ngoài
      return {
          enableCards: function() {
              categoryCards.forEach(card => {
                  card.style.pointerEvents = 'auto';
                  card.style.opacity = '1';
              });
              console.log('Đã kích hoạt category cards');
          },
          disableCards: function() {
              categoryCards.forEach(card => {
                  card.style.pointerEvents = 'none';
                  card.style.opacity = '0.5';
              });
              console.log('Đã vô hiệu hóa category cards');
          }
      };
}
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
