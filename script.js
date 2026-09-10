let btn = document.querySelector("#addBtn");
let inp = document.querySelector("#addTask");
let description = document.querySelector("#description");

let category = document.querySelector("#category");
let priority = document.querySelector("#priority");
let dueDate = document.querySelector("#dueDate");

let search = document.querySelector("#search");
let statusFilter = document.querySelector("#statusFilter");
let priorityFilter = document.querySelector("#priorityFilter");

let ul = document.querySelector("#taskList");

let total = document.querySelector("#total");
let pending = document.querySelector("#pending");
let progress = document.querySelector("#progress");
let completed = document.querySelector("#completed");



let update = null;

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// =========================
// Add / Update Task
// =========================

btn.addEventListener("click", function () {

    // Empty task check
    if (inp.value.trim() === "") {

        alert("Please enter a task");

        return;
    }


    // =========================
    // Update Existing Task
    // =========================

    if (update) {

        let id = Number(update.dataset.id);


        tasks.forEach(function (task) {

            if (task.id === id) {

                task.title = inp.value;

                task.description = description.value;

                task.category = category.value;

                task.priority = priority.value;

                task.dueDate = dueDate.value;

            }

        });


        saveTasks();

        showTasks();

        update = null;

        btn.innerText = "Add Task";


        // Inputs clear
        inp.value = "";

        description.value = "";

        dueDate.value = "";

        return;
    }


    // =========================
    // Create New Task
    // =========================

    let task = {

        id: Date.now(),

        title: inp.value,

        description: description.value,

        category: category.value,

        priority: priority.value,

        status: "Pending",

        dueDate: dueDate.value

    };


    
    tasks.push(task);


    
    saveTasks();

    showTasks();


    // Inputs clear
    inp.value = "";

    description.value = "";

    dueDate.value = "";

});


// =========================
// Show Tasks
// =========================

function showTasks() {

    ul.innerHTML = "";


    let searchValue = search.value.toLowerCase();

    let statusValue = statusFilter.value;

    let priorityValue = priorityFilter.value;


    tasks.forEach(function (task) {


        // =========================
        // Search
        // =========================

        if (!task.title.toLowerCase().includes(searchValue)) {

            return;

        }


        // =========================
        // Status Filter
        // =========================

        if (
            statusValue !== "All" &&
            task.status !== statusValue
        ) {

            return;

        }


        // =========================
        // Priority Filter
        // =========================

        if (
            priorityValue !== "All" &&
            task.priority !== priorityValue
        ) {

            return;

        }


        // =========================
        // Create LI
        // =========================

        let li = document.createElement("li");

        li.dataset.id = task.id;


        // =========================
        // Task Information
        // =========================

        let taskInfo = document.createElement("div");

        taskInfo.classList.add("task-info");


        // Title

        let title = document.createElement("div");

        title.classList.add("task-title");

        title.innerText = task.title;


        // Description

        let desc = document.createElement("div");

        desc.classList.add("task-description");

        desc.innerText = task.description;


        // =========================
        // Details
        // =========================

        let details = document.createElement("div");

        details.classList.add("task-details");

        details.innerHTML = `
            Category:
            <span class="category">${task.category}</span>

            |

            Priority:
            <span class="priority ${task.priority.toLowerCase()}">
                ${task.priority}
            </span>

            |

            Due:
            <span class="due-date">
                ${task.dueDate || "No Date"}
            </span>
        `;


        // =========================
        // Status
        // =========================

        let status = document.createElement("span");

        status.classList.add("status");


        if (task.status === "Pending") {

            status.classList.add("pending");

        }

        else if (task.status === "In Progress") {

            status.classList.add("in-progress");

        }

        else {

            status.classList.add("completed-status");

        }


        status.innerText = task.status;


        // =========================
        // Update Button
        // =========================

        let updateBtn = document.createElement("button");

        updateBtn.innerHTML =
            `<i class="fa-solid fa-pen"></i> Update`;

        updateBtn.classList.add("update");


        // =========================
        // Delete Button
        // =========================

        let delBtn = document.createElement("button");

        delBtn.innerHTML =
            `<i class="fa-solid fa-trash"></i> Delete`;

        delBtn.classList.add("delete");


        // =========================
        // Complete Button
        // =========================

        let completeBtn = document.createElement("button");

        completeBtn.innerHTML =
            `<i class="fa-solid fa-check"></i> Complete`;

        completeBtn.classList.add("complete");


        // =========================
        // Append Elements
        // =========================

        taskInfo.appendChild(title);

        taskInfo.appendChild(desc);

        taskInfo.appendChild(details);


        li.appendChild(taskInfo);

        li.appendChild(status);

        li.appendChild(completeBtn);

        li.appendChild(delBtn);

        li.appendChild(updateBtn);


        ul.appendChild(li);

    });


    // Counters update
    updateCounters();

}


// =========================
// Delete / Update / Complete
// =========================

ul.addEventListener("click", function (event) {


    // Button ya button ke andar icon click hua
    if (
        event.target.tagName === "BUTTON" ||
        event.target.parentElement.tagName === "BUTTON"
    ) {


        // Actual button find karo
        let button = event.target.closest("button");


        // Button ka parent LI
        let listItems = button.parentElement;


        // Task ID
        let id = Number(listItems.dataset.id);


        // =========================
        // Delete
        // =========================

        if (button.classList.contains("delete")) {


            tasks = tasks.filter(function (task) {

                return task.id !== id;

            });


            saveTasks();

            showTasks();

        }


        // =========================
        // Update
        // =========================

        if (button.classList.contains("update")) {


            update = listItems;


            inp.value =
                listItems
                    .querySelector(".task-title")
                    .textContent
                    .trim();


            description.value =
                listItems
                    .querySelector(".task-description")
                    .textContent
                    .trim();


            category.value =
                listItems
                    .querySelector(".category")
                    .textContent
                    .trim();


            priority.value =
                listItems
                    .querySelector(".priority")
                    .textContent
                    .trim();


            let dateValue =
                listItems
                    .querySelector(".due-date")
                    .textContent
                    .trim();


            // Agar date hai to input mein set karo
            if (dateValue !== "No Date") {

                dueDate.value = dateValue;

            }

            else {

                dueDate.value = "";

            }


            // Button text change
            btn.innerText = "Update";

        }


        // =========================
        // Complete
        // =========================

        if (button.classList.contains("complete")) {


            tasks.forEach(function (task) {

                if (task.id === id) {

                    task.status = "Completed";

                }

            });


            saveTasks();

            showTasks();

        }

    }

});


// =========================
// Search
// =========================

search.addEventListener("input", function () {

    showTasks();

});


// =========================
// Status Filter
// =========================

statusFilter.addEventListener("change", function () {

    showTasks();

});


// =========================
// Priority Filter
// =========================

priorityFilter.addEventListener("change", function () {

    showTasks();

});


// =========================
// Update Counters
// =========================

function updateCounters() {


    // Total Tasks

    total.innerText = tasks.length;


    // Pending Tasks

    let pendingTasks = tasks.filter(function (task) {

        return task.status === "Pending";

    });

    pending.innerText = pendingTasks.length;


    // In Progress Tasks

    let progressTasks = tasks.filter(function (task) {

        return task.status === "In Progress";

    });

    progress.innerText = progressTasks.length;


    // Completed Tasks

    let completedTasks = tasks.filter(function (task) {

        return task.status === "Completed";

    });

    completed.innerText = completedTasks.length;

}


// =========================
// Local Storage
// =========================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// =========================
// First Load
// =========================

showTasks();

