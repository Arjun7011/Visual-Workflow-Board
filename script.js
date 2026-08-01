const taskInput = document.getElementById("taskInput");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


const themeToggle = document.getElementById("themeToggle");

// Load saved theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️ Light Mode";
}

// Toggle Theme
themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    if (isDark) {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️ Light Mode";
    } else {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙 Dark Mode";
    }
});


function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    const text = taskInput.value.trim();

    if (!text) return;

    const task = {
        id: Date.now(),
        text,
        status: "todo"
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
}

function renderTasks() {

    document.querySelectorAll(".task-list")
        .forEach(col => col.innerHTML = "");

    tasks.forEach(task => {

        const div = document.createElement("div");

        div.classList.add("task");
        div.draggable = true;
        div.dataset.id = task.id;

        div.innerHTML = `
            <span>${task.text}</span>
            <button class="delete-btn"
                onclick="deleteTask(${task.id})">
                X
            </button>
        `;

        div.addEventListener("dragstart", dragStart);
        div.addEventListener("dragend", dragEnd);

        document
            .getElementById(task.status)
            .appendChild(div);
    });
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

let draggedTask = null;

function dragStart() {
    draggedTask = this;
    this.classList.add("dragging");
}

function dragEnd() {
    this.classList.remove("dragging");
}

document.querySelectorAll(".task-list").forEach(column => {

    column.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    column.addEventListener("drop", function () {

        const taskId = Number(draggedTask.dataset.id);

        const task = tasks.find(t => t.id === taskId);

        task.status = this.id;

        saveTasks();
        renderTasks();
    });
});

renderTasks();