function turnOffPopUp(){
    console.log("I must be the reason why");
    let pop_up = document.querySelector(".pop-up");
    pop_up.style.display = "none"; 
  }
  
  function turnOnPopUp(){
    console.log("I must be the reason why........");
    let pop_up = document.querySelector(".pop-up");
    pop_up.style.display = "block"; 
  }
  
  function confirmPage(){
    console.log("Đã chọn ngày cho Tasker");
    window.location.href = "/order-task/step3";
  }
  function onClickButtonSelectTasker(){
    let buttons = document.querySelectorAll(".select-tasker-button");
    for (b of buttons)
    {
      b.setAttribute("onclick","turnOnPopUp()")
      // b.onclick=turnOnPopUp();
    } 
  }
  
  onClickButtonSelectTasker();
  //const collection = document.getElementsByClassName("select-tasker-button");
  
  const datepicker = document.querySelector(".datepicker");
  const yearInput = datepicker.querySelector(".year-input");
  const monthInput = datepicker.querySelector(".month-input");
  const nextBtn = datepicker.querySelector(".next");
  const prevBtn = datepicker.querySelector(".prev");
  const dates = datepicker.querySelector(".dates");
  
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
    console.log("I must be the reason why");
    let pop_up = document.querySelector(".pop-up");
    pop_up.style.display = "none"; 
  }
  
  function turnOnPopUp(){
    console.log("I must be the reason why........");
    let pop_up = document.querySelector(".pop-up");
    pop_up.style.display = "block"; 
  }