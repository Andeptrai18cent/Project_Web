// Xử lý chọn ngày - GIỮ NGUYÊN
function turnOffPopUp(){
    let pop_up = document.querySelector(".pop-up");
    pop_up.style.display = "none"; 
}
  
function turnOnPopUp(){
    let pop_up = document.querySelector(".pop-up");
    pop_up.style.display = "block"; 
}
  
async function confirmPage(){
    var hour_min = parseInt(hour_select.value)
    selectedDate.setHours(hour_min / 100)
    selectedDate.setMinutes(hour_min % 100)
    console.log(selectedDate);
    console.log(selected_tasker_id)
    const response = await fetch("http://localhost:8080/post-new-task",{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            task_date: selectedDate,
            tasker_id: selected_tasker_id})
    })
    const data = await response.json()
    if (data.success)
    {
        alert("Đã tạo Task mới thành công")
        window.location.href = "/order-task/step3";
    }
    else
    {
        alert("Tạo Task mới không thành công, xin vui lòng thử lại sau")
    }
}

function onClickButtonSelectTasker(e, tasker_id){
    let buttons = e.querySelectorAll(".select-tasker-button");
    for (b of buttons)
    {
        b.id = tasker_id
        //b.setAttribute("onclick","turnOnPopUp()")
        b.addEventListener('click', () => {
            selected_tasker_id = tasker_id
            turnOnPopUp()
        })
        // b.onclick=turnOnPopUp();
    } 
}

// THÊM BIẾN PHÂN TRANG - KHÔNG ẢNH HƯỞNG LOGIC CŨ
let currentTaskerPage = 1;
let taskersPerPage = 4; // Số taskers hiển thị mỗi trang
let allTaskers = []; // Lưu toàn bộ taskers được fetch
let currentSortMode = 0; // Track sort mode hiện tại

//const collection = document.getElementsByClassName("select-tasker-button");
const datepicker = document.querySelector(".datepicker");
const yearInput = datepicker.querySelector(".year-input");
const monthInput = datepicker.querySelector(".month-input");
const nextBtn = datepicker.querySelector(".next");
const prevBtn = datepicker.querySelector(".prev");
const dates = datepicker.querySelector(".dates");
const hour_select = document.querySelector(".dropdown-button")
let selectedDate = new Date();
let year = selectedDate.getFullYear();
let month = selectedDate.getMonth();

// handle next month nav - GIỮ NGUYÊN
nextBtn.addEventListener("click", () => {
    if (month === 11) year++;
    month = (month + 1) % 12;
    displayDates();
});

// handle prev month nav - GIỮ NGUYÊN  
prevBtn.addEventListener("click", () => {
    if (month === 0) year--;
    month = (month - 1 + 12) % 12;
    displayDates();
});

// handle month input change event - GIỮ NGUYÊN
monthInput.addEventListener("change", () => {
    month = monthInput.selectedIndex;
    displayDates();
});

// handle year input change event - GIỮ NGUYÊN
yearInput.addEventListener("change", () => {
    year = yearInput.value;
    displayDates();
});

const updateYearMonth = () => {
    monthInput.selectedIndex = month;
    yearInput.value = year;
};

const handleDateClick = (e) => {
    const button = e.target;

    // remove the 'selected' class from other buttons
    const selected = dates.querySelector(".selected");
    selected && selected.classList.remove("selected");

    // add the 'selected' class to current button
    button.classList.add("selected");

    // set the selected date
    selectedDate = new Date(year, month, parseInt(button.textContent));
};

// render the dates in the calendar interface - GIỮ NGUYÊN
const displayDates = () => {
    // update year & month whenever the dates are updated
    updateYearMonth();

    // clear the dates
    dates.innerHTML = "";

    //* display the last week of previous month

    // get the last date of previous month
    const lastOfPrevMonth = new Date(year, month, 0);

    for (let i = 0; i <= lastOfPrevMonth.getDay(); i++) {
        const text = lastOfPrevMonth.getDate() - lastOfPrevMonth.getDay() + i;
        const button = createButton(text, true, -1);
        dates.appendChild(button);
    }

    //* display the current month

    // get the last date of the month
    const lastOfMOnth = new Date(year, month + 1, 0);

    for (let i = 1; i <= lastOfMOnth.getDate(); i++) {
        const button = createButton(i, false);
        button.addEventListener("click", handleDateClick);
        dates.appendChild(button);
    }

    //* display the first week of next month

    const firstOfNextMonth = new Date(year, month + 1, 1);

    for (let i = firstOfNextMonth.getDay(); i < 7; i++) {
        const text = firstOfNextMonth.getDate() - firstOfNextMonth.getDay() + i;

        const button = createButton(text, true, 1);
        dates.appendChild(button);
    }
};

const createButton = (text, isDisabled = false, type = 0) => {
    const currentDate = new Date();

    // determine the date to compare based on the button type
    let comparisonDate = new Date(year, month + type, text);

    // check if the current button is the date today
    const isToday =
        currentDate.getDate() === text &&
        currentDate.getFullYear() === year &&
        currentDate.getMonth() === month;

    // check if the current button is selected
    const selected = selectedDate.getTime() === comparisonDate.getTime();

    const button = document.createElement("button");
    button.textContent = text;
    button.disabled = isDisabled;
    button.classList.toggle("today", isToday && !isDisabled);
    button.classList.toggle("selected", selected);
    return button;
};

displayDates();

// FUNCTION MỚI: TẠO TASKER PAGINATION CONTROLS
function createTaskerPaginationControls(totalItems, currentPage, itemsPerPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Tìm hoặc tạo pagination container
    let paginationContainer = document.getElementById('tasker-pagination-container');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'tasker-pagination-container';
        paginationContainer.className = 'tasker-pagination-container';
        
        // Thêm sau tasker-info-box
        const taskerInfoBox = document.querySelector('.tasker-info-box');
        taskerInfoBox.parentNode.insertBefore(paginationContainer, taskerInfoBox.nextSibling);
    }
    
    // Clear existing pagination
    paginationContainer.innerHTML = '';
    
    if (totalPages <= 1) return; // Không hiển thị pagination nếu chỉ có 1 trang
    
    // Create pagination HTML
    const paginationHTML = `
        <div class="tasker-pagination-info">
            <span>Hiển thị ${Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}-${Math.min(currentPage * itemsPerPage, totalItems)} của ${totalItems} taskers</span>
        </div>
        <div class="tasker-pagination-controls">
            <button class="tasker-pagination-btn" id="tasker-prev-btn" ${currentPage === 1 ? 'disabled' : ''}>
                ‹ Trước
            </button>
            <div class="tasker-pagination-pages" id="tasker-pagination-pages"></div>
            <button class="tasker-pagination-btn" id="tasker-next-btn" ${currentPage === totalPages ? 'disabled' : ''}>
                Sau ›
            </button>
        </div>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
    
    // Create page numbers
    const pagesContainer = document.getElementById('tasker-pagination-pages');
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // First page button
    if (startPage > 1) {
        pagesContainer.innerHTML += `<button class="tasker-pagination-number" data-page="1">1</button>`;
        if (startPage > 2) {
            pagesContainer.innerHTML += `<span class="tasker-pagination-ellipsis">...</span>`;
        }
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        pagesContainer.innerHTML += `
            <button class="tasker-pagination-number ${i === currentPage ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>
        `;
    }
    
    // Last page button
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pagesContainer.innerHTML += `<span class="tasker-pagination-ellipsis">...</span>`;
        }
        pagesContainer.innerHTML += `<button class="tasker-pagination-number" data-page="${totalPages}">${totalPages}</button>`;
    }
    
    // Add event listeners
    document.getElementById('tasker-prev-btn').addEventListener('click', () => {
        if (currentPage > 1) {
            goToTaskerPage(currentPage - 1);
        }
    });
    
    document.getElementById('tasker-next-btn').addEventListener('click', () => {
        if (currentPage < totalPages) {
            goToTaskerPage(currentPage + 1);
        }
    });
    
    document.querySelectorAll('.tasker-pagination-number').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const page = parseInt(e.target.dataset.page);
            goToTaskerPage(page);
        });
    });
}

// FUNCTION MỚI: CHUYỂN TRANG TASKER
function goToTaskerPage(page) {
    currentTaskerPage = page;
    displayCurrentTaskerPage();
    
    // Scroll to top của tasker container
    document.querySelector('.tasker-info-box').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// FUNCTION MỚI: HIỂN THỊ TRANG TASKER HIỆN TẠI
async function displayCurrentTaskerPage() {
    const startIndex = (currentTaskerPage - 1) * taskersPerPage;
    const endIndex = startIndex + taskersPerPage;
    const taskersToShow = allTaskers.slice(startIndex, endIndex);
    
    // Clear current display
    task_info_box.innerHTML = '';
    
    // Hiển thị taskers của trang hiện tại (GIỐNG HỆT LOGIC CŨ)
    for (const tasker of taskersToShow) {
        let temp_list = document.getElementsByTagName("template");
        let temp = temp_list[0];
        let clon = temp.content.cloneNode(true);
        let response_user = await fetch(`http://localhost:8080/user/user-info/${tasker.user_id}`);
        let user_info = await response_user.json();
        let response_session = await fetch('http://localhost:8080/test-get-session');
        let session_data = await response_session.json();
        const response_service = await fetch(`http://localhost:8080/service-info/${session_data.service_id}`);
        const service_data = await response_service.json();
        
        clon.querySelector(".tasker-name").innerHTML = user_info.name;
        clon.querySelector(".tasker-wage").innerHTML = `${tasker.hourly_rate} đồng/ giờ`;
        clon.querySelector(".star_count").innerHTML = tasker.average_rating;
        clon.querySelector(".specific-task-count").innerHTML = `Đã làm ${tasker.task_count} Task về ${service_data.name}`;
        clon.querySelector(".introduction-info").innerHTML = tasker.bio;
        onClickButtonSelectTasker(clon, tasker.tasker_id);
        task_info_box.appendChild(clon);
    }
    
    // Update pagination controls
    createTaskerPaginationControls(allTaskers.length, currentTaskerPage, taskersPerPage);
}

// Xử lý hiện thông tin Tasker - MODIFIED TO SUPPORT PAGINATION
var prev_mode = 0
var selected_tasker_id = 0
const task_info_box = document.querySelector(".tasker-info-box")

document.addEventListener('DOMContentLoaded', async function() {
    // Reset pagination khi load trang
    currentTaskerPage = 1;
    currentSortMode = 0;
    
    let response = await fetch("http://localhost:8080/get_tasker-by-service-group")
    let data = await response.json()
    
    // LỰU TOÀN BỘ DATA VÀO BIẾN GLOBAL
    allTaskers = data;
    
    // HIỂN THỊ TRANG ĐẦU TIÊN
    await displayCurrentTaskerPage();
    
}, false);

const select_sort_mode = document.getElementById("select-sort-tasker-mode")

select_sort_mode.addEventListener('click', async() => {
    let response = undefined
    let data = undefined
    const mode = parseInt(select_sort_mode.value)
    console.log(mode, prev_mode)
    if (mode == prev_mode)
        return
        
    // Reset pagination khi sort
    currentTaskerPage = 1;
    currentSortMode = mode;
    
    if (mode == 0) // đề nghị
    {
        response = await fetch("http://localhost:8080/get_tasker-by-service-group")
    }
    else if (mode == 1) // tăng dần
    {
        response = await fetch("http://localhost:8080/sort-tasker-by-wage?order=ascend")
    }
    else if (mode == 2) // giảm dần
    {
        response = await fetch('http://localhost:8080/sort-tasker-by-wage?order=descend')
    }
    else if (mode == 3) // số đánh giá
    {
        response = await fetch('http://localhost:8080/sort-tasker-by-rating')
    }
    else if (mode == 4) // số công việc
    {
        response = await fetch('http://localhost:8080/sort-tasker-by-task-done')
    }
    
    data = await response.json()
    
    // LỰU DATA MỚI VÀO BIẾN GLOBAL
    allTaskers = data;
    
    // HIỂN THỊ TRANG ĐẦU TIÊN CỦA DATA MỚI
    await displayCurrentTaskerPage();
    
    console.log("Something snap...", data)
    prev_mode = mode
})