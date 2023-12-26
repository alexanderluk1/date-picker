import {
  addMonths,
  subMonths,
  format,
  fromUnixTime,
  getUnixTime,
  startOfMonth,
  startOfWeek,
  endOfMonth,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns";

const button = document.querySelector(".date-picker-button");
const datePicker = document.querySelector(".date-picker");
const datePickerHeaderText = document.querySelector(".current-month");
const previousMonthButton = document.querySelector(".prev-month-button");
const nextMonthButton = document.querySelector(".next-month-button");
const dateGrid = document.querySelector(".date-picker-grid-dates");
let currentDate = new Date();

// --- Opening of Date Picker ---
button.addEventListener("click", () => {
  datePicker.classList.toggle("show");
  // Converts from Unix time back to regular time
  const selectedDate = fromUnixTime(button.dataset.selectedDate);

  // Reset the date header to current date when clicked
  currentDate = selectedDate;
  setupDatePicker(selectedDate);
});

// --- Setting the Date Picker Box ---
function setupDatePicker(selectedDate) {
  // Setting the date header
  datePickerHeaderText.innerText = format(currentDate, "MMMM - yyyy");
  setupDates(selectedDate);
}

function setupDates(selectedDate) {
  // get first day of month --> get first day of that week
  const firstWeekStart = startOfWeek(startOfMonth(currentDate));
  // get last day of month --> get last day of that week
  const lastWeekEnd = endOfWeek(endOfMonth(currentDate));
  // This provides an array of all the days between start and end
  const dates = eachDayOfInterval({
    start: firstWeekStart,
    end: lastWeekEnd,
  });

  // Clears all the child elements inside grid
  dateGrid.innerHTML = "";

  // For each day in array dates,
  dates.forEach((date) => {
    const dateElement = document.createElement("button");
    dateElement.classList.add("date");
    dateElement.innerText = date.getDate();
    // If diff month than currentDate, set diff styling
    if (!isSameMonth(date, currentDate)) {
      dateElement.classList.add("date-picker-other-month-date");
    }
    // If same day as the current selected date, add selected styling
    if (isSameDay(date, selectedDate)) {
      dateElement.classList.add("selected");
    }
    // When user clicks on a date, it sets it to the date selected
    dateElement.addEventListener("click", () => {
      setButtonDate(date);
      datePicker.classList.remove("show");
    });

    dateGrid.appendChild(dateElement);
  });
}

// --- Set the Current date to the button ---
function setButtonDate(date) {
  // Format the inner text of the button to required format
  button.innerText = format(date, "MMMM do, yyyy");
  // Set timestamp to the button in Unix time (1703573893)
  button.dataset.selectedDate = getUnixTime(date);
}
setButtonDate(new Date());

// Setting the previous month button
previousMonthButton.addEventListener("click", () => {
  const selectedDate = fromUnixTime(button.dataset.selectedDate);
  currentDate = subMonths(currentDate, 1);
  setupDatePicker(selectedDate);
});

// Setting the next month button
nextMonthButton.addEventListener("click", () => {
  const selectedDate = fromUnixTime(button.dataset.selectedDate);
  currentDate = addMonths(currentDate, 1);
  setupDatePicker(selectedDate);
});
