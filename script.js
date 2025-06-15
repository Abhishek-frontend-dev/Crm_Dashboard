// Get all input elements and buttons
let nameInput = document.getElementById("name");
let lastNameInput = document.getElementById("last-name");
let emailInput = document.getElementById("email");
let ageInput = document.getElementById("age");
let designationSelect = document.getElementById("designation");
let createBtn = document.getElementById("create-btn");
const userGrid = document.getElementById("user-container");
const form = document.getElementById("form-container");
const themBtn = document.getElementById("themBtn");

const element = document.documentElement;

//On page load check saved theme and apply it
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    element.classList.add("dark");
    themBtn.textContent = "☀️Light Mode";
  } else {
    element.classList.remove("dark");
    themBtn.textContent = "🌙 Dark Mode";
  }
});

//On button click toggle class and update localStorage
themBtn.addEventListener("click", () => {
  element.classList.toggle("dark");

  const isDark = element.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  themBtn.textContent = isDark ? "☀️Light Mode" : "🌙 Dark Mode";
});

let users = [];
let editIndex = null; // Track whether we are editing or creating

function saveData() {
  localStorage.setItem("userData", JSON.stringify(users));
}

//1st step show card to renderuser

function showCard() {
  // Get trimmed values from inputs
  const firstName = nameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const email = emailInput.value.trim();
  const age = Number(ageInput.value.trim());
  const designation = designationSelect.value.trim();

  // Validate inputs before adding user
  if (!firstName || !lastName || !email || !age || !designation) {
    alert("Please fill all fields");
    return; // stop if any field is empty
  }

  // user object
  const user = {
    firstName,
    lastName,
    email,
    age,
    designation,
    isActive: true, //new property for active status
  };
  // console.log(users.map((u) => u.age)); // Check if all are numbers

  //3rd step (2nd step updating user data and rendering new user data)
  if (editIndex !== null) {
    //measne we are updating the specific user
    users[editIndex] = user; //user updated in index[] updat user data now
    editIndex = null; //again reseting the index to null that means we are in create mode now
    createBtn.textContent = "Create User"; //change the text for ux/ui
  } else {
    users.push(user); //this is already there befor edit btn but now if anything is nut true we will add data to users object
  }
  renderUsers();
  nameInput.value = "";
  lastNameInput.value = "";
  emailInput.value = "";
  ageInput.value = "";
  designationSelect.value = "";
}

//geting users from local storage

const savedUsers = localStorage.getItem("userData");
if (savedUsers) {
  users = JSON.parse(savedUsers);
  renderUsers();
}
function renderUsers(userList = users) {
  //befor search brtn (function renderUsers() this is because to render filetr list also)
  userGrid.innerHTML = ""; // clear existing cards

  userList.forEach((user, index) => {
    //so before search btn i am looping in usersn (users.forEach)
    const fullName = `${user.firstName} ${user.lastName}`;
    const card = document.createElement("div");
    card.className =
      "w-full from-pink-200 to-purple-300 bg-conic-90 dark:from-green-700 dark:to-purple-800 p-4 flex flex-col text-start gap-3 rounded-2xl shadow-2xl hover:bg-conic-210 transition";

    card.innerHTML = `
      <img src="https://cdn.pixabay.com/photo/2019/08/11/18/59/icon-4399701_1280.png?seed=${
        user.firstName
      }${
      user.lastName
    }" alt="user" class="rounded-full border-2 sm:w-30 sm:h-30  md:w-20 md:h-20 lg:h-40 lg:w-40" />
      <h3>Name: ${fullName}</h3>
      <p>Email: ${user.email}</p>
      <p>Age: ${user.age}</p>
      <p>Role: ${user.designation}</p>

      <label class="inline-flex items-center cursor-pointer">
        <span class="me-4">Active Status</span>
        <input type="checkbox" class="sr-only peer status-toggle" ${
          user.isActive ? "checked" : ""
        } data-index="${index}">
        <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-700 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600 dark:peer-checked:bg-orange-600"></div>
      </label>

      <button class="edit-btn p-2 bg-gradient-to-r from-orange-500 to-pink-400 dark:from-orange-500 dark:to-red-800 cursor-pointer rounded-4xl" 
      data-index="${index}">Edit User</button>
      <button id="delete-btn" class="p-2 bg-gradient-to-r from-orange-300 to-pink-500 dark:from-red-500 dark:to-orange-800 cursor-pointer rounded-4xl"
       data-index="${index}">Delete User</button>
    `;
    userGrid.appendChild(card);
    saveData();
  });

  //2nd step

  //deleteButton part
  const deleteButtons = document.querySelectorAll("#delete-btn");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      const confirmDelete = confirm(
        "Ary You Sure you want to delete this user?"
      );
      if (confirmDelete) {
        users.splice(index, 1);
      }
      renderUsers(); // update UI
      saveData();
    });
  });

  //3rd step -1st setup selecting user index for filling input feield
  // Edit
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.getAttribute("data-index");
      const user = users[index];

      nameInput.value = user.firstName;
      lastNameInput.value = user.lastName;
      emailInput.value = user.email;
      ageInput.value = user.age;
      designationSelect.value = user.designation;

      editIndex = index;
      createBtn.textContent = "Update User";
      saveData();
    });
  });

  //Active user status

  document.querySelectorAll(".status-toggle").forEach((toggle) => {
    toggle.addEventListener("change", () => {
      const index = toggle.getAttribute("data-index"); //to get index from chebox
      users[index].isActive = toggle.checked; // checked by index
      updateStateBar(); // 👈 Update state bar after toggle
    });
  });
  updateStateBar();
}

//stat bar

function updateStateBar() {
  const total = users.length;
  const activeUser = users.filter((user) => user.isActive).length;
  const avrAge =
    total === 0
      ? 0
      : Math.round(users.reduce((sum, u) => sum + parseInt(u.age), 0) / total);

  document.getElementById("total-user").textContent = total;
  document.getElementById("active-user").textContent = activeUser;
  document.getElementById("average-user").textContent = avrAge;
}

//search
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", () => {
  const searchValue = searchInput.value.toLowerCase();

  const filteredUsers = users.filter((user) => {
    return (
      user.email.toLowerCase().includes(searchValue) ||
      user.firstName.toLowerCase().includes(searchValue) ||
      user.lastName.toLowerCase().includes(searchValue) ||
      user.designation.toLowerCase().includes(searchValue)
    );
  });

  if (filteredUsers.length > 0) {
    console.log("Matching users:", filteredUsers);
    renderUsers(filteredUsers); // This will only render filtered cards
  } else {
    alert("User not found!");
    renderUsers(); // Renders all users again
  }
});

let selectInput = document.getElementById("select-by");

selectInput.addEventListener("change", () => {
  let selectValue = selectInput.value.trim().toLowerCase();

  let filteredUser;

  if (selectValue === "developer") {
    filteredUser = users.filter((user) =>
      user.designation.toLowerCase().includes("dev")
    );
  } else if (selectValue === "designer") {
    filteredUser = users.filter((user) =>
      user.designation.toLowerCase().includes("design")
    );
  } else if (selectValue === "hr") {
    filteredUser = users.filter((user) =>
      user.designation.toLowerCase().includes("hr")
    );
  } else if (selectValue === "age:20+") {
    filteredUser = users.filter((user) => user.age >= 20 && user.age < 30);
  } else if (selectValue === "age:30+") {
    filteredUser = users.filter((user) => user.age >= 30 && user.age < 40);
  } else if (selectValue === "age:40+") {
    filteredUser = users.filter((user) => user.age >= 40);
  } else {
    alert("Filter Not Match");
  }

  renderUsers(filteredUser);
  console.log("Filter Result:", filteredUser);
});
