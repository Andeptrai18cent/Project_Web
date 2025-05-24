// Xử lý khi nhấn pop-up
const overlay = document.querySelector('.pop_up_btn_task_overlay');
const closeBtn = document.querySelector('.pop_up_btn_task_close');
const cancelBtn = document.querySelector('.pop_up_btn_task_cancel');
const confirmBtn = document.querySelector('.pop_up_btn_task_confirm');
const stars = document.querySelectorAll('.pop_up_btn_task_stars span');

let selectedRating = 0;

// Đóng popup
closeBtn.addEventListener('click', () => {
  overlay.style.display = 'none';
});

cancelBtn.addEventListener('click', () => {
  overlay.style.display = 'none';
});

// confirmBtn.addEventListener('click', () => {
//   // phần code khi nhấn đồng ý
//   overlay.style.display = 'none';
// });

// Đánh sao
stars.forEach(star => {
  star.addEventListener('click', () => {
    selectedRating = parseInt(star.dataset.value);
    stars.forEach(s => s.classList.remove('active'));
    for (let i = 0; i < selectedRating; i++) {
      stars[i].classList.add('active');
    }
  });
});

function changePopUp(status, task_id) {
  const title_popup = document.querySelector("#title_pop_up")
  const stars_div = document.querySelector(".pop_up_btn_task_stars")
  const review_content = document.querySelector(".pop_up_btn_task_comment")
  const buttons = document.querySelector(".pop_up_btn_task_comment")
  const context = document.querySelector(".pop_up_btn_task_text")
  if (status!="Completed")
  {
    stars_div.style.display = 'none'
    review_content.style.display = 'none'
    context.style.display = 'block'
  }
  if (status=="Pending")
  {
    title_popup.innerHTML = "Hủy đơn"
    context.innerHTML = "Bạn đồng ý hủy đơn không ?"
    confirmBtn.addEventListener('click', async () =>{
      const response = await fetch(`http://localhost:8080/user/cancel-pending-task?task_id=${task_id}`,
        {
          method: "POST"
        }
      )
      const data = await response.json()
      if (data.success)
      {
        alert("Hủy Task thành công")
        location.reload()
      }
      else
        alert("Hủy Task không thành công, vui lòng thử lại sau")
    })
  }
  else if (status=="Confirmed")
  {
    title_popup.innerHTML = "Yêu cầu hủy đơn"
    context.innerHTML = "Bạn đồng ý tạo yêu cầu hủy đơn không ?"
    confirmBtn.addEventListener('click', async () =>{
      const response = await fetch(`http://localhost:8080/user/cancel-confirmed-task?task_id=${task_id}`,
        {
          method: "POST"
        }
      )
      const data = await response.json()
      if (data.success)
      {
        alert("Tạo yêu cầu hủy Task thành công")
        location.reload()
      }
      else
        alert("Tạo yêu cầu hủy Task không thành công, vui lòng thử lại sau")
    })
  }
  else if (status=='Payment_waiting')
  {
    title_popup.innerHTML = "Yêu cầu xác nhận thanh toán"
    context.innerHTML = "Bạn đồng ý tạo yêu cầu xác nhận thanh toán không ?"
    confirmBtn.addEventListener('click', async () =>{
      const response = await fetch(`http://localhost:8080/user/payment-confirmation-request?task_id=${task_id}`,
        {
          method: "POST"
        }
      )
      const data = await response.json()
      if (data.success)
      {
        alert("Tạo yêu cầu xác nhận thanh toán thành công")
        location.reload()
      }
      else
        alert("Tạo yêu cầu xác nhận thanh toán không thành công, vui lòng thử lại sau")
    })
  }
  else if (status=="Completed")
  {
    const comment = document.querySelector('.pop_up_btn_task_comment').value;
    confirmBtn.addEventListener('click', async () =>{
      const response = await fetch(`http://localhost:8080/user/task/review?task_id=${task_id}`,
        {
          method: "POST",
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            rating: selectedRating,
            review_content: comment
          })
        }
      )
      const data = await response.json()
      if (data.success)
      {
        alert("Đánh giá Task thành công")
        location.reload()
      }
      else
        alert("Đánh giá Task không thành công, vui lòng thử lại sau")
    })
  }
}


//Xử lý hiển thị Task
async function loadTaskers(sortType) {
      try {
        const response = await fetch(`http://localhost:8080/user/tasks?status=${sortType}`);
        const data = await response.json();
        const list = document.getElementById("task_container")
        list.innerHTML = ''; // Xóa danh sách cũ
        data.forEach(async task => {
          let temp_list = document.getElementsByTagName("template")
          let temp = temp_list[0];
          let clon = temp.content.cloneNode(true);
          const response_service = await fetch(`http://localhost:8080/service-info/${task.service_id}`)
          const service_data = await response_service.json()
          const response_tasker = await fetch(`http://localhost:8080/tasker-info/${task.tasker_id}`)
          const tasker_data = await response_tasker.json()
          const response_user = await fetch(`http://localhost:8080/user/user-info/${tasker_data.user_id}`)
          const user_data = await response_user.json()
          var btn = await getButtonForTask(task.status)
          if (btn)
          {
            if (task.status == 'Completed')
            {
              var check_review = undefined
              const response = await fetch(`http://localhost:8080/review/check-info/${task.task_id}`)
              check_review = await response.json()
              if (check_review.success)
                btn.disabled = true
            }
            btn.addEventListener('click', () => {
              overlay.style.display = 'flex';
              changePopUp(task.status, task.task_id)
            });
            clon.querySelector(".order-card").appendChild(btn)
          }
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

async function getButtonForTask(status) {
  var btn = document.createElement("button")
  if (status=='Pending')
  {
    btn.innerHTML += 'Hủy Task'
  }
  else if (status=='Confirmed')
  {
    btn.innerHTML += 'Yêu cầu hủy'
  }
  else if (status=='Payment_waiting')
  {
    btn.innerHTML += 'Xác nhận thanh toán'
  }
  else if (status=='Completed')
  {
    btn.innerHTML += 'Đánh giá'
  }
  else btn = undefined
  return btn
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