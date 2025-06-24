// ================== PHÂN TRANG - CHỈ THÊM CODE NÀY ==================
let currentPage = 1;
let itemsPerPage = 6; // Số task/trang
let allTasks = [];    // Toàn bộ danh sách task

function createPaginationControls(totalItems, currentPage, itemsPerPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'pagination-container';
        paginationContainer.className = 'pagination-container';
        const ordersContainer = document.getElementById('task_container');
        ordersContainer.parentNode.insertBefore(paginationContainer, ordersContainer.nextSibling);
    }
    paginationContainer.innerHTML = '';
    if (totalPages <= 1) return;
    const paginationHTML = `
        <div class="pagination-info">
            <span>Hiển thị ${Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}-${Math.min(currentPage * itemsPerPage, totalItems)} của ${totalItems} tasks</span>
        </div>
        <div class="pagination-controls">
            <button class="pagination-btn" id="prev-btn" ${currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
                Trước
            </button>
            <div class="pagination-pages" id="pagination-pages"></div>
            <button class="pagination-btn" id="next-btn" ${currentPage === totalPages ? 'disabled' : ''}>
                Sau
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;
    paginationContainer.innerHTML = paginationHTML;
    const pagesContainer = document.getElementById('pagination-pages');
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    if (startPage > 1) {
        pagesContainer.innerHTML += `<button class="pagination-number" data-page="1">1</button>`;
        if (startPage > 2) {
            pagesContainer.innerHTML += `<span class="pagination-ellipsis">...</span>`;
        }
    }
    for (let i = startPage; i <= endPage; i++) {
        pagesContainer.innerHTML += `
            <button class="pagination-number ${i === currentPage ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>
        `;
    }
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pagesContainer.innerHTML += `<span class="pagination-ellipsis">...</span>`;
        }
        pagesContainer.innerHTML += `<button class="pagination-number" data-page="${totalPages}">${totalPages}</button>`;
    }
    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    });
    document.getElementById('next-btn').addEventListener('click', () => {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    });
    document.querySelectorAll('.pagination-number').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const page = parseInt(e.target.dataset.page);
            goToPage(page);
        });
    });
}
function goToPage(page) {
    currentPage = page;
    displayCurrentPage();
    document.getElementById('task_container').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}
async function displayCurrentPage() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const tasksToShow = allTasks.slice(startIndex, endIndex);

    const list = document.getElementById("task_container");
    list.innerHTML = '';
    for (const task of tasksToShow) {
        let temp = document.getElementsByTagName("template")[0];
        let clon = temp.content.cloneNode(true);
        const response_service = await fetch(`http://localhost:8080/service-info/${task.service_id}`)
        const service_data = await response_service.json()
        const response_user = await fetch(`http://localhost:8080/user/user-info/${task.user_id}`)
        const user_data = await response_user.json()
        var btn = await getButtonForTask(task.status)
        if (btn) {
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
        if (task.status=='Payment_waiting' || task.status=='Payment_Confirmation_waiting')
        {
            const response_tasker = await fetch(`http://localhost:8080/tasker-info/${task.tasker_id}`);
            const tasker_data = await response_tasker.json();
            const start_work = new Date(task.work_start_at)
            const end_work = new Date(task.work_end_at)
            const diffInMs = end_work - start_work;
            const diffInMinutes = Math.round(diffInMs / (1000 * 60));
            const diffInHours = diffInMinutes / 60;
            var taskerEarning = tasker_data.hourly_rate * diffInHours;
            task_infos[6].style.display = 'block';
            task_infos[6].innerHTML += `${Math.round(taskerEarning)} đồng`
        }
        list.appendChild(clon)
    }
    createPaginationControls(allTasks.length, currentPage, itemsPerPage);
}
// ================== KẾT THÚC PHÂN TRANG ==================


// ================== CÁC PHẦN CODE CŨ (GIỮ NGUYÊN LOGIC) ==================
const overlay = document.querySelector('.pop_up_btn_task_overlay');
const closeBtn = document.querySelector('.pop_up_btn_task_close');
const cancelBtn = document.querySelector('.pop_up_btn_task_cancel');
const confirmBtn = document.querySelector('.pop_up_btn_task_confirm');
const stars = document.querySelectorAll('.pop_up_btn_task_stars span');
const confirmNotBtn = document.querySelector('.pop_up_btn_task_confirm-not')
let selectedRating = 0;

// Đóng popup
closeBtn.addEventListener('click', () => {
  overlay.style.display = 'none';
});
cancelBtn.addEventListener('click', () => {
  overlay.style.display = 'none';
});

// Đánh sao
function changePopUp(status, task_id) {
  const title_popup = document.querySelector("#title_pop_up")
  const stars_div = document.querySelector(".pop_up_btn_task_stars")
  const review_content = document.querySelector(".pop_up_btn_task_comment")
  const context = document.querySelector(".pop_up_btn_task_text")
  stars_div.style.display = 'none'
  review_content.style.display = 'none'
  context.style.display = 'block'
  confirmNotBtn.style.display = 'none'
  if (status=='Cancel_Confirmation_waiting' || status=='Payment_Confirmation_waiting' || status=='Pending')
  {
    confirmNotBtn.style.display = 'inline-block'
  }
  if (status=="Pending")
  {
    title_popup.innerHTML = "Nhận Task"
    context.innerHTML = "Bạn đồng ý nhận Task không ?"
    confirmBtn.onclick = null; confirmNotBtn.onclick = null;
    confirmBtn.addEventListener('click', async () =>{
      const response = await fetch(`http://localhost:8080/tasker-confirm-tasks?task_id=${task_id}&ans=YES`,
        {
          method: "POST"
        }
      )
      const data = await response.json()
      if (data.success)
      {
        alert("Nhận Task thành công")
        location.reload()
      }
      else
        alert("Nhận Task không thành công, vui lòng thử lại sau")
    })
    confirmNotBtn.addEventListener('click', async () =>{
      const response = await fetch(`http://localhost:8080/tasker-confirm-tasks?task_id=${task_id}&ans=NO`,
        {
          method: "POST"
        }
      )
      const data = await response.json()
      if (data.success)
      {
        alert("Từ chối nhận Task thành công")
        location.reload()
      }
      else
        alert("Từ chối nhận Task không thành công, vui lòng thử lại sau")
    })
  }
  else if (status=='Cancel_Confirmation_waiting')
  {
    title_popup.innerHTML = "Hủy Task"
    context.innerHTML = "Bạn đồng ý hủy Task không ?"
    confirmBtn.onclick = null; confirmNotBtn.onclick = null;
    confirmBtn.addEventListener('click', async () =>{
      const response = await fetch(`http://localhost:8080/tasker/task-cancel-confirm?task_id=${task_id}&ans=YES`,
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
    confirmNotBtn.addEventListener('click', async () =>{
      const response = await fetch(`http://localhost:8080/tasker/task-cancel-confirm?task_id=${task_id}&ans=NO`,
        {
          method: "POST"
        }
      )
      const data = await response.json()
      if (data.success)
      {
        alert("Từ chối hủy Task thành công")
        location.reload()
      }
      else
        alert("Từ chối hủy Task không thành công, vui lòng thử lại sau")
    })
  }
  else if (status=="Confirmed")
  {
    title_popup.innerHTML = "Bắt đầu công việc"
    context.innerHTML = "Bạn muốn bắt đầu công việc không?"
    confirmBtn.onclick = null;
    confirmBtn.addEventListener('click', async () =>{
      const response = await fetch(`http://localhost:8080/task/start-task?task_id=${task_id}`,
        {
          method: "POST"
        }
      )
      const data = await response.json()
      if (data.success)
      {
        alert("Bắt đầu Task thành công")
        location.reload()
      }
      else
        alert("Bắt đầu Task không thành công, vui lòng thử lại sau")
    })
  }
  else if (status=='Work_waiting')
  {
    title_popup.innerHTML = "Kết thúc công việc"
    context.innerHTML = "Bạn muốn kết thúc công việc không ?"
    confirmBtn.onclick = null;
    confirmBtn.addEventListener('click', async () =>{
      const response = await fetch(`http://localhost:8080/task/end-work?task_id=${task_id}`,
        {
          method: "POST"
        }
      )
      const data = await response.json()
      if (data.success)
      {
        alert("kết thúc công việc thành công")
        location.reload()
      }
      else
        alert("kết thúc công việc không thành công, vui lòng thử lại sau")
    })
  }
  else if (status=="Payment_Confirmation_waiting")
  {
    title_popup.innerHTML = "Xác nhận thanh toán"
    context.innerHTML = "Bạn đồng ý xác nhận thanh toán không ?"
    confirmBtn.onclick = null; confirmNotBtn.onclick = null;
    confirmBtn.addEventListener('click', async () =>{
      const response = await fetch(`http://localhost:8080/tasker/task-payment-confirm?task_id=${task_id}&ans=YES`,
        {
          method: "POST"
        }
      )
      const data = await response.json()
      if (data.success)
      {
        alert("xác nhận thanh toán thành công")
        location.reload()
      }
      else
        alert("xác nhận thanh toán không thành công, vui lòng thử lại sau")
    })
    confirmNotBtn.addEventListener('click', async () =>{
      const response = await fetch(`http://localhost:8080/tasker/task-payment-confirm?task_id=${task_id}&ans=NO`,
        {
          method: "POST"
        }
      )
      const data = await response.json()
      if (data.success)
      {
        alert("Từ chối xác nhận thanh toán thành công")
        location.reload()
      }
      else
        alert("Từ chối xác nhận thanh toán không thành công, vui lòng thử lại sau")
    })
  }
  else if (status=="Completed")
  {
    title_popup.innerHTML="Đánh giá"
    context.style.display = 'block'
    const check_review = async() => {
      const response = await fetch(`http://localhost:8080/review/check-info/${task_id}`)
      const return_val = await response.json()
      return return_val
    }
    const get_review_data = async() => {
      const review_data = await check_review()
      if (review_data)
      {
        stars_div.style.display = 'flex'
        selectedRating = parseInt(review_data.data.rating)
        context.innerHTML = review_data.data.review_content
        stars.forEach(star => {
          stars.forEach(s => s.classList.remove('active'));
          for (let i = 0; i < selectedRating; i++) {
            stars[i].classList.add('active');
          }
        });
      }
      else
      {
        context.innerHTML = "Chưa có đánh giá nào "
      }
    }
    get_review_data()
  }
}

async function loadTaskers(sortType) {
    try {
        const response = await fetch(`http://localhost:8080/tasker/tasks/?status=${sortType}`);
        const data = await response.json();
        allTasks = data;         // Phân trang
        currentPage = 1;         // Về trang đầu
        await displayCurrentPage(); // Gọi hàm hiển thị trang hiện tại
    } catch (err) {
        console.log('Lỗi tải dữ liệu:', err);
    }
}

async function getButtonForTask(status) {
  var btn = document.createElement("button")
  if (status=='Cancel_Confirmation_waiting')
  {
    btn.innerHTML += 'Xác nhận hủy'
  }
  else if (status=='Confirmed')
  {
    btn.innerHTML += 'Bắt đầu Task'
  }
  else if (status=='Work_waiting')
  {
    btn.innerHTML += 'Kết thúc Task'
  }
  else if (status=='Payment_Confirmation_waiting')
  {
    btn.innerHTML += 'Xác nhận thanh toán'
  }
  else if (status=='Completed')
  {
    btn.innerHTML += 'Xem đánh giá'
  }
  else if (status=='Pending')
  {
    btn.innerHTML += "Nhận Task"
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

function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

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
