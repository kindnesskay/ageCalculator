const day = document.querySelector("#day");
const month = document.querySelector("#month");
const year = document.querySelector("#year");
const day_info = document.querySelector("#day_info");
const month_info = document.querySelector("#month_info");
const year_info = document.querySelector("#year_info");
const btn2 = document.querySelector("#btn2");
let button = document.querySelector("#compute");

let dateDay,
  dateMonth,
  dateYear = 0;
function set() {
  dateDay = day.value;
  dateMonth = month.value - 1;
  dateYear = year.value;
  try {
    const errorDay = handleErrors(day);
    const errorMonth = handleErrors(month);
    const errorYear = handleErrors(year);
    return errorDay && errorMonth && errorYear;
  } catch (error) {
    console.error(error);
  }
}
function clearResults() {
  day_info.innerHTML = "--";
  month_info.innerHTML = "--";
  year_info.innerHTML = "--";
}

function countYear(past, present) {
  if (past > present) return 0;
  if (
    present.getDate() >= past.getDate() &&
    present.getMonth() >= past.getMonth()
  ) {
    return present.getFullYear() - past.getFullYear();
  }
  return present.getFullYear() - past.getFullYear() - 1;
}
function countMonth(past, present) {
  if (past > present) return 0;
  let months = 12 - past.getMonth() + present.getMonth();
  if (!newMonth(past.getDate())) {
    months -= 1;
  }
  if (months >= 12) {
    months -= 12;
  }

  return months;
}

function countDays(past, present) {
  if (past > present) return 0;
  let lastMonth = present;
  lastMonth.setMonth(present.getMonth() - 1);
  let today = new Date();
  function compare(count) {
    lastMonth.setDate(Number(past.getDate()) + count);
    if (lastMonth.getDate() == today.getDate()) {
      return true;
    }
    return false;
  }
  let count = 1;
  while (!compare(count)) {
    count++;
  }
  return count;
}

function checkDate(element) {
  let error = document.getElementById(`${element.id}_error`);
  let label = document.querySelector(`label[for="${element.id}"]`);
  if (!validDate(dateYear, dateMonth, dateDay)) {
    label.classList.add("error");
    error.innerHTML = "Must be a valid date";
    return false;
  }
  return true;
}

function newMonth(date) {
  let today = new Date().getDate();
  if (Number(today) >= Number(date)) {
    return true;
  }
  return false;
}

function compute(e) {
  e.preventDefault();
  clearResults();
  if (!set()) return false;
  let past = new Date(dateYear, dateMonth, dateDay);
  let present = new Date();
  if (!checkDate(day)) return false;

  async function runAnimationsSequentially() {
    await animateResult(Number(countYear(past, present)), year_info);
    await animateResult(Number(countMonth(past, present)), month_info);
    await animateResult(Number(countDays(past, present)), day_info);
  }

  runAnimationsSequentially();
}

function setDate() {
  let a = handleErrors(this);
  return (dateDay = this.value);
}

function setMonth() {
  handleErrors(this);
  return (dateMonth = this.value - 1);
}

function setYear() {
  handleErrors(this);
  checkYear(this.value);
  return (dateYear = this.value);
}
function handleErrors(element) {
  let error = document.getElementById(`${element.id}_error`);
  let label = document.querySelector(`label[for="${element.id}"]`);
  let pattern = new RegExp(element.pattern);
  if (element.id == "year") {
    if (!checkYear(element.value)) {
      label.classList.add("error");
      error.innerHTML = "Must be in the past";
      return false;
    }
  }

  if (!element.value) {
    label.classList.add("error");
    error.innerHTML = "This field is required";
    return false;
  }

  if (element.value.length > element.maxLength) {
    element.value = element.value.slice(0, element.maxLength);
    return false;
  }

  if (!pattern.test(element.value)) {
    label.classList.add("error");
    error.innerHTML = element.title;
    return false;
  }
  error.innerHTML = "";
  label.classList.remove("error");
  return true;
}
function checkYear(year) {
  return year > new Date().getFullYear() ? false : true;
}

function validDate(year, month, day) {
  return new Date(year, month + 1, 0).getDate() >= day ? true : false;
}

async function animateResult(destination, element) {
  let value = 0;
  const intervalTime = 50;

  const animate = () => {
    return new Promise((resolve) => {
      const a = setInterval(() => {
        element.innerHTML = value;
        value++;

        if (value >= destination + 1) {
          clearInterval(a);
          resolve();
        }
      }, intervalTime);
    });
  };

  await animate();
}

button.addEventListener("click", compute);
btn2.addEventListener("click", compute);
day.addEventListener("input", setDate);
month.addEventListener("input", setMonth);
year.addEventListener("input", setYear);
