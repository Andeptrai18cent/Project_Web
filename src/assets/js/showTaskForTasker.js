async function loadTaskers(sortType) {
      try {
        const response = await fetch(`http://localhost:8080/tasker/tasks/?status=${sortType}`);
        const data = await response.json();
        const list = document.getElementById("task_container")
        console.log(data)
        list.innerHTML = ''; // Xóa danh sách cũ
        data.forEach(async task => {
          let temp = document.getElementsByTagName("template")[0];
          let clon = temp.content.cloneNode(true);
          const response_service = await fetch(`http://localhost:8080/service-info/${task.service_id}`)
          const service_data = await response_service.json()
          const response_user = await fetch(`http://localhost:8080/user/user-info/${task.user_id}`)
          const user_data = await response_user.json()
          var task_infos = clon.querySelectorAll(".order-info")
          task_infos[0].innerHTML += service_data.name
          task_infos[1].innerHTML += user_data.name
          task_infos[2].innerHTML += user_data.phone_number
          task_infos[3].innerHTML += task.location
          task_infos[4].innerHTML += task.description
          task_infos[5].innerHTML += task.task_date
          list.appendChild(clon)
        });
      } catch (err) {
        console.log('Lỗi tải dữ liệu:', err);
      }
    }

// Gọi mặc định khi trang load
window.onload = () => loadTaskers('Pending');

document.querySelectorAll('.task-tab').forEach(tab => {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.task-tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    loadTaskers(tab.id)
  });
});


// Xử lý thanh lựa chọn của user/tasker
const user_link_dropdown = document.querySelector("#myDropdown")

const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');

document.addEventListener('DOMContentLoaded', () => {
  getToken();
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
  console.log("The button works")
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
