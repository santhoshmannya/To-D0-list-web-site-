let tasks =
JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

document.getElementById("todayDate").textContent =
new Date().toLocaleDateString();

function saveTasks(){
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

function addTask(){

    const text =
    document.getElementById("taskInput")
    .value.trim();

    if(text === ""){
        return;
    }

    tasks.push({
        id:Date.now(),
        text:text,
        category:
        document.getElementById("category").value,
        priority:
        document.getElementById("priority").value,
        date:
        document.getElementById("dueDate").value,
        completed:false
    });

    document.getElementById("taskInput").value="";
    document.getElementById("dueDate").value="";

    saveTasks();
    renderTasks();
}

function deleteTask(id){

    tasks =
    tasks.filter(
        task => task.id !== id
    );

    saveTasks();
    renderTasks();
}

function toggleTask(id){

    tasks =
    tasks.map(task => {

        if(task.id === id){
            task.completed =
            !task.completed;
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

function editTask(id){

    const task =
    tasks.find(
        t => t.id === id
    );

    const updated =
    prompt(
        "Edit Task",
        task.text
    );

    if(updated){

        task.text = updated;

        saveTasks();
        renderTasks();
    }
}

function setFilter(type){

    currentFilter = type;

    renderTasks();
}

function updateStats(){

    const total =
    tasks.length;

    const completed =
    tasks.filter(
        t => t.completed
    ).length;

    const active =
    total - completed;

    document.getElementById(
        "totalTasks"
    ).textContent = total;

    document.getElementById(
        "activeTasks"
    ).textContent = active;

    document.getElementById(
        "completedTasks"
    ).textContent = completed;

    const progress =
    total === 0
    ? 0
    : Math.round(
        (completed / total) * 100
    );

    document.getElementById(
        "progressText"
    ).textContent =
    progress + "%";

    document.getElementById(
        "progressFill"
    ).style.width =
    progress + "%";
}

function renderTasks(){

    const taskList =
    document.getElementById("taskList");

    const search =
    document.getElementById("searchInput")
    .value
    .toLowerCase();

    let filtered =
    tasks.filter(task =>
        task.text
        .toLowerCase()
        .includes(search)
    );

    if(currentFilter === "active"){
        filtered =
        filtered.filter(
            task => !task.completed
        );
    }

    if(currentFilter === "completed"){
        filtered =
        filtered.filter(
            task => task.completed
        );
    }

    taskList.innerHTML = "";

    if(filtered.length === 0){

        taskList.innerHTML = `
            <div class="empty">
                <h2>📭</h2>
                <p>No Tasks Found</p>
            </div>
        `;

        updateStats();
        return;
    }

    filtered.forEach(task => {

        const li =
        document.createElement("li");

        li.className =
        `task ${
            task.completed
            ? "completed"
            : ""
        }`;

        li.innerHTML = `
        <div class="task-left">

            <div class="task-title">
                ${task.text}
            </div>

            <div class="task-meta">

                <span class="tag ${task.category.toLowerCase()}">
                    ${task.category}
                </span>

                <span class="tag ${task.priority.toLowerCase()}">
                    ${task.priority}
                </span>

                <span class="tag">
                    📅 ${task.date || "No Date"}
                </span>

            </div>

        </div>

        <div class="task-actions">

            <button
                class="complete-btn"
                onclick="toggleTask(${task.id})">
                ✓
            </button>

            <button
                class="edit-btn"
                onclick="editTask(${task.id})">
                Edit
            </button>

            <button
                class="delete-btn"
                onclick="deleteTask(${task.id})">
                Delete
            </button>

        </div>
        `;

        taskList.appendChild(li);

    });

    updateStats();
}

document
.getElementById("searchInput")
.addEventListener(
    "input",
    renderTasks
);

document
.getElementById("taskInput")
.addEventListener(
    "keypress",
    function(e){

        if(e.key === "Enter"){
            addTask();
        }
    }
);

renderTasks();