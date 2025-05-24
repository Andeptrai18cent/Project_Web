// Xử lý chọn ngày
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
  
  // handle next month nav
  nextBtn.addEventListener("click", () => {
    if (month === 11) year++;
    month = (month + 1) % 12;
    displayDates();
  });
  
  // handle prev month nav
  prevBtn.addEventListener("click", () => {
    if (month === 0) year--;
    month = (month - 1 + 12) % 12;
    displayDates();
  });
  
  // handle month input change event
  monthInput.addEventListener("change", () => {
    month = monthInput.selectedIndex;
    displayDates();
  });
  
  // handle year input change event
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
  
  // render the dates in the calendar interface
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
  
  function turnOffPopUp(){
    let pop_up = document.querySelector(".pop-up");
    pop_up.style.display = "none"; 
  }
  
  function turnOnPopUp(){
    let pop_up = document.querySelector(".pop-up");
    pop_up.style.display = "block"; 
  }

// Xử lý hiện thông tin Tasker
var prev_mode = 0
var selected_tasker_id = 0
const task_info_box = document.querySelector(".tasker-info-box")
document.addEventListener('DOMContentLoaded', async function() {
  let response = await fetch("http://localhost:8080/get_tasker-by-service-group")
  let data = await response.json()
  task_info_box.innerHTML = ''
  data.forEach(async(tasker) => {
  let temp_list = document.getElementsByTagName("template")
  let temp = temp_list[0];
  let clon = temp.content.cloneNode(true);
  let response_user = await fetch(`http://localhost:8080/user/user-info/${tasker.user_id}`)
  let user_info = await response_user.json()
  let response_session = await fetch('http://localhost:8080/test-get-session')
  let session_data = await response_session.json()
  const response_service = await fetch(`http://localhost:8080/service-info/${session_data.service_id}`)
  const service_data = await response_service.json()
  clon.querySelector(".tasker-name").innerHTML = user_info.name
  clon.querySelector(".tasker-wage").innerHTML = `${tasker.hourly_rate} đồng/ giờ`
  clon.querySelector(".star_count").innerHTML = tasker.average_rating
  clon.querySelector(".specific-task-count").innerHTML = `Đã làm ${tasker.task_count} Task về ${service_data.name}`
  clon.querySelector(".introduction-info").innerHTML = tasker.bio
  onClickButtonSelectTasker(clon, tasker.tasker_id);
  task_info_box.appendChild(clon)
  });
}, false);

const select_sort_mode = document.getElementById("select-sort-tasker-mode")

select_sort_mode.addEventListener('click', async() => {
  let response = undefined
  let data = undefined
  const mode = parseInt(select_sort_mode.value)
  console.log(mode, prev_mode)
  if (mode == prev_mode)
    return
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
  task_info_box.innerHTML = ''
  data = await response.json()
  for (tasker of data){
    let temp_list = document.getElementsByTagName("template")
    let temp = temp_list[0];
    let clon = temp.content.cloneNode(true);
    let response_user = await fetch(`http://localhost:8080/user/user-info/${tasker.user_id}`)
    let user_info = await response_user.json()
    let response_session = await fetch('http://localhost:8080/test-get-session')
    let session_data = await response_session.json()
    const response_service = await fetch(`http://localhost:8080/service-info/${session_data.service_id}`)
    const service_data = await response_service.json()
    clon.querySelector(".tasker-name").innerHTML = user_info.name
    clon.querySelector(".tasker-wage").innerHTML = `${tasker.hourly_rate} đồng/ giờ`
    clon.querySelector(".star_count").innerHTML = tasker.average_rating
    clon.querySelector(".specific-task-count").innerHTML = `Đã làm ${tasker.task_count} Task về ${service_data.name}`
    clon.querySelector(".introduction-info").innerHTML = tasker.bio
    onClickButtonSelectTasker(clon, tasker.tasker_id);
    task_info_box.appendChild(clon)
  };
  console.log("Something snap...", data)
  prev_mode = mode
})