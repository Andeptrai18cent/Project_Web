// Xử lý khi nhấn pop-up
const overlay = document.querySelector('.pop_up_btn_task_overlay');
const closeBtn = document.querySelector('.pop_up_btn_task_close');
const cancelBtn = document.querySelector('.pop_up_btn_task_cancel');
const confirmBtn = document.querySelector('.pop_up_btn_task_confirm');
const stars = document.querySelectorAll('.pop_up_btn_task_stars span');

let selectedRating = 0;

// THÊM BIẾN PHÂN TRANG - KHÔNG ẢH HƯỞNG LOGIC CŨ
let currentPage = 1;
let itemsPerPage = 6; // Số task hiển thị mỗi trang
let allTasks = []; // Lưu toàn bộ tasks được fetch
let currentStatus = 'Pending'; // Track status hiện tại

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
    confirmBtn.addEventListener('click', async () =>{
      const comment = document.querySelector('.pop_up_btn_task_comment').value;
      console.log(comment)
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

// FUNCTION MỚI: TẠO PAGINATION CONTROLS
function createPaginationControls(totalItems, currentPage, itemsPerPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Tìm hoặc tạo pagination container
    let paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'pagination-container';
        paginationContainer.className = 'pagination-container';
        
        // Thêm sau orders-container
        const ordersContainer = document.getElementById('task_container');
        ordersContainer.parentNode.insertBefore(paginationContainer, ordersContainer.nextSibling);
    }
    
    // Clear existing pagination
    paginationContainer.innerHTML = '';
    
    if (totalPages <= 1) return; // Không hiển thị pagination nếu chỉ có 1 trang
    
    // Create pagination HTML
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
    
    // Create page numbers
    const pagesContainer = document.getElementById('pagination-pages');
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // First page button
    if (startPage > 1) {
        pagesContainer.innerHTML += `<button class="pagination-number" data-page="1">1</button>`;
        if (startPage > 2) {
            pagesContainer.innerHTML += `<span class="pagination-ellipsis">...</span>`;
        }
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        pagesContainer.innerHTML += `
            <button class="pagination-number ${i === currentPage ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>
        `;
    }
    
    // Last page button
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pagesContainer.innerHTML += `<span class="pagination-ellipsis">...</span>`;
        }
        pagesContainer.innerHTML += `<button class="pagination-number" data-page="${totalPages}">${totalPages}</button>`;
    }
    
    // Add event listeners
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

// FUNCTION MỚI: CHUYỂN TRANG
function goToPage(page) {
    currentPage = page;
    displayCurrentPage();
    
    // Scroll to top của task container
    document.getElementById('task_container').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// FUNCTION MỚI: HIỂN THỊ TRANG HIỆN TẠI
async function displayCurrentPage() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const tasksToShow = allTasks.slice(startIndex, endIndex);
    
    const list = document.getElementById("task_container");
    list.innerHTML = ''; // Clear current display
    
    // Hiển thị tasks của trang hiện tại (GIỐNG HỆT LOGIC CŨ)
    for (const task of tasksToShow) {
        let temp_list = document.getElementsByTagName("template");
        let temp = temp_list[0];
        let clon = temp.content.cloneNode(true);
        
        const response_service = await fetch(`http://localhost:8080/service-info/${task.service_id}`);
        const service_data = await response_service.json();
        const response_tasker = await fetch(`http://localhost:8080/tasker-info/${task.tasker_id}`);
        const tasker_data = await response_tasker.json();
        const response_user = await fetch(`http://localhost:8080/user/user-info/${tasker_data.user_id}`);
        const user_data = await response_user.json();
        
        var btn = await getButtonForTask(task.status);
        if (btn) {
            if (task.status == 'Completed') {
                var check_review = undefined;
                const response = await fetch(`http://localhost:8080/review/check-info/${task.task_id}`);
                check_review = await response.json();
                if (check_review.success)
                    btn.disabled = true;
            }
            btn.addEventListener('click', () => {
                overlay.style.display = 'flex';
                changePopUp(task.status, task.task_id);
            });
            clon.querySelector(".order-card").appendChild(btn);
        }
        
        var task_infos = clon.querySelectorAll(".order-info");
        task_infos[0].innerHTML += service_data.name;
        task_infos[1].innerHTML += user_data.name;
        task_infos[2].innerHTML += user_data.phone_number;
        task_infos[3].innerHTML += task.location;
        task_infos[4].innerHTML += task.description;
        task_infos[5].innerHTML += task.task_date;
        if (task.status=='Payment_waiting' || task.status=='Payment_Confirmation_waiting')
        {
          const start_work = new Date(task.work_start_at)
          const end_work = new Date(task.work_end_at)
          const diffInMs = end_work - start_work;
          const diffInMinutes = Math.round(diffInMs / (1000 * 60)); // Làm tròn theo phút
          const diffInHours = diffInMinutes / 60; // Chuyển về giờ thập phân
          console.log(`${start_work}/ ${end_work}`)
          console.log(diffInHours)
          console.log(tasker_data.hourly_rate)
          var taskerEarning = tasker_data.hourly_rate * diffInHours;
          task_infos[6].style.display = 'block';
          task_infos[6].innerHTML += `${Math.round(taskerEarning)} đồng`
        }
        list.appendChild(clon);
    }
    
    // Update pagination controls
    createPaginationControls(allTasks.length, currentPage, itemsPerPage);
}

//Xử lý hiển thị Task - MODIFIED TO SUPPORT PAGINATION
async function loadTaskers(sortType) {
    try {
        // Reset pagination khi change tab
        currentPage = 1;
        currentStatus = sortType;
        
        const response = await fetch(`http://localhost:8080/user/tasks?status=${sortType}`);
        const data = await response.json();
        
        // LỰU TOÀN BỘ DATA VÀO BIẾN GLOBAL
        allTasks = data;
        
        // HIỂN THỊ TRANG ĐẦU TIÊN
        await displayCurrentPage();
        
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