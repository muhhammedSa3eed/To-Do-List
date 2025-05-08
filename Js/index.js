// ^ HTML Elements
let searchInput = document.querySelector("#searchInput");
let newTaskBtn = document.querySelector("#newTask");
let modal = document.querySelector("#modal");
let statusInput = document.querySelector("#status");
let categoryInput = document.querySelector("#category");
let titleInput = document.querySelector("#title");
let descriptionInput = document.querySelector("#description");
let addBtn = document.querySelector("#addBtn");
let updateBtn = document.querySelector("#updateBtn");
let html = document.querySelector("#html");

// & App Variables
let containers = {
  nextUp: document.querySelector("#nextUp"),
  inProgress: document.querySelector("#inProgress"),
  done: document.querySelector("#done"),
};
let tasksList = getTasks();
let countersEl = {
  nextUp: document.querySelector("#nextUpCounter"),
  inProgress: document.querySelector(" #inProgressCounter"),
  done: document.querySelector("#doneCounter"),
};
let counters = {
  nextUp: 0,
  inProgress: 0,
  done: 0,
};
let outerIndex;
const titleRegex = /^[A-Z][a-z]{3,}$/;
const descriptionRegex = /^\w{25,100}/;
const colors = [
  "#FF57335C",
  "#33FF575C",
  "#3357FF5C",
  "#FFC3005C",
  "#C700395C",
  "#900C3F5C",
  "#5818455C",
  "#1ABC9C5C",
  "#E74C3C5C",
  "#2ECC715C",
  "#3498DB5C",
  "#9B59B65C",
  "#F1C40F5C",
  "#E67E225C",
  "#34495E5C",
  "#16A0855C",
  "#2980B95C",
  "#8E44AD5C",
  "#2C3E505C",
  "#D354005C",
  "#BDC3C75C",
  "#7F8C8D5C",
];

displayAllTasks();

// * Function
function showModal() {
  window.scroll(0, 0);
  document.body.style.overflow = "hidden";
  modal.classList.replace("d-none", "d-flex");
}
function hideModal() {
  modal.classList.replace("d-flex", "d-none");
  document.body.style.overflow = "auto";
}
function setCounter(status) {
  countersEl[status].innerHTML = +countersEl[status].innerHTML + 1;
}
function addTask() {
  if (
    validate(titleRegex, titleInput) &&
    validate(descriptionRegex, descriptionInput)
  ) {
    let task = {
      status: statusInput.value,
      category: categoryInput.value,
      title: titleInput.value,
      description: descriptionInput.value,
      bgColor: "#0D1117",
    };
    tasksList.push(task);
    setTasks();
    displayTask(tasksList.length - 1);
    hideModal();
    clearInputs();
  } else {
    Swal.fire({
      icon: "error",
      text: "Invalid Data",
    });
  }
}
function displayTask(index) {
  var taskHTML = `
<div class="task">
<h3 class="text-capitalize">${tasksList[index].title}</h3>
<p class="description text-capitalize">${tasksList[index].description}</p>
<h4 class="category ${tasksList[index].category} text-capitalize">${tasksList[index].category}</h4>
<ul class="task-options list-unstyled d-flex gap-3 fs-5 m-0">
<li><i class="bi bi-pencil-square" onclick="getData(${index})"></i></li>
<li><i class="bi bi-trash-fill" onclick="deleteTask(${index})" ></i></li>
<li><i class="bi bi-palette-fill" onclick="randomColor(event,${index})"></i></li></ul>
</div>
`;
  containers[tasksList[index].status].querySelector(".tasks").innerHTML +=
    taskHTML;
  setCounter(tasksList[index].status);
}
function clearInputs() {
  titleInput.value = "";
  descriptionInput.value = "";
}
function setTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasksList));
}
function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}
function displayAllTasks() {
  for (let i = 0; i < tasksList.length; i++) {
    displayTask(i);
  }
}
function deleteTask(index) {
  Swal.fire({
    title: "Are you sure?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      tasksList.splice(index, 1);
      setTasks();
      resetContainers();
      resetCounters();
      displayAllTasks();
      Swal.fire({
        title: "Deleted!",
        icon: "success",
      });
    }
  });
}
function resetContainers() {
  for (key in containers) {
    containers[key].querySelector(".tasks").innerHTML = "";
  }
}
function resetCounters() {
  for (key in countersEl) {
    countersEl[key].innerHTML = 0;
  }
}
function searchTasks() {
  resetContainers();
  resetCounters();
  let term = searchInput.value;
  for (let i = 0; i < tasksList.length; i++) {
    if (
      tasksList[i].title.toUpperCase().includes(term.toUpperCase()) ||
      tasksList[i].category.toUpperCase().includes(term.toUpperCase())
    ) {
      displayTask(i);
    }
  }
}
function updateTask() {
  tasksList[outerIndex].status = statusInput.value;
  tasksList[outerIndex].category = categoryInput.value;
  tasksList[outerIndex].title = titleInput.value;
  tasksList[outerIndex].description = descriptionInput.value;
  setTasks();
  resetContainers();
  resetCounters();
  displayAllTasks();
  hideModal();
}
function getData(index) {
  outerIndex = index;
  showModal();
  statusInput.value = tasksList[index].status;
  categoryInput.value = tasksList[index].category;
  titleInput.value = tasksList[index].title;
  descriptionInput.value = tasksList[index].description;
  addBtn.classList.replace("d-block", "d-none");
  updateBtn.classList.replace("d-none", "d-block");
}
function validate(regex, element) {
  if (regex.test(element.value)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
    element.parentElement.nextElementSibling.classList.replace(
      "d-block",
      "d-none"
    );
    return true;
  }
  element.classList.remove("is-valid");
  element.classList.add("is-invalid");
  element.parentElement.nextElementSibling.classList.replace(
    "d-none",
    "d-block"
  );
  return false;
}
function randomColor(event, index) {
  const color = colors[Math.trunc(Math.random() * colors.length)];
  tasksList[index].bgColor = color;
  setTasks();
  event.target.closest(".task").style.backgroundColor = color;
}

// ~ Events
newTaskBtn.addEventListener("click", showModal);

modal.addEventListener("click", function (event) {
  if (event.target.id === "modal") {
    hideModal();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    hideModal();
  }
});

addBtn.addEventListener("click", addTask);
searchInput.addEventListener("input", searchTasks);
updateBtn.addEventListener("click", updateTask);
titleInput.addEventListener("input", function () {
  validate(titleRegex, titleInput);
});
descriptionInput.addEventListener("input", function () {
  validate(descriptionRegex, descriptionInput);
});
