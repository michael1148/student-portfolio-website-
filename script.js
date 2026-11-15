// ==========================================
// STUDENT PORTFOLIO WEBSITE
// Main JavaScript File
// ==========================================


// ==========================================
// ACADEMIC PLANNER
// ==========================================

const taskForm = document.getElementById("taskForm");

if (taskForm) {

    const taskInput = document.getElementById("taskInput");
    const taskCategory = document.getElementById("taskCategory");
    const taskPriority = document.getElementById("taskPriority");
    const taskDeadline = document.getElementById("taskDeadline");

    const taskList = document.getElementById("taskList");
    const filterButtons = document.querySelectorAll("[data-filter]");

    let tasks = JSON.parse(localStorage.getItem("academicTasks")) || [];
    let currentFilter = "all";

    // Display today's date
    const currentDate = document.getElementById("currentDate");

    if (currentDate) {
        currentDate.textContent = new Date().toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );
    }

    // Save tasks to browser storage
    function saveTasks() {
        localStorage.setItem("academicTasks", JSON.stringify(tasks));
    }

    // Get today's date
    function getToday() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    // Add a new task
    taskForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = taskInput.value.trim();
        const deadline = taskDeadline.value;

        if (!name || !deadline) {
            alert("Please complete all required fields.");
            return;
        }

        const newTask = {
            id: Date.now(),
            name: name,
            category: taskCategory.value,
            priority: taskPriority.value,
            deadline: deadline,
            completed: false
        };

        tasks.push(newTask);

        saveTasks();
        taskForm.reset();

        renderTasks();
        updateDashboard();
    });


    // Display tasks
    function renderTasks() {

        taskList.innerHTML = "";

        let filteredTasks = tasks.filter(function(task) {

            if (currentFilter === "pending") {
                return !task.completed;
            }

            if (currentFilter === "completed") {
                return task.completed;
            }

            if (currentFilter === "high") {
                return task.priority === "High" && !task.completed;
            }

            return true;
        });

        if (filteredTasks.length === 0) {
            taskList.innerHTML =
                '<p class="empty-message">No tasks found. Add a task to get started.</p>';
            return;
        }

        filteredTasks.forEach(function(task) {

            const card = document.createElement("div");
            card.className = "task-card";

            if (task.completed) {
                card.classList.add("completed-task");
            }

            const isOverdue =
                !task.completed && task.deadline < getToday();

            if (isOverdue) {
                card.classList.add("overdue");
            }

            const details = document.createElement("div");
            details.className = "task-details";

            const title = document.createElement("h3");
            title.textContent = task.name;

            if (task.completed) {
                title.classList.add("completed-text");
            }

            const info = document.createElement("p");
            info.textContent =
                `${task.category} | ${task.priority} Priority | Due: ${task.deadline}`;

            if (isOverdue) {
                info.textContent += " | OVERDUE";
            }

            const actions = document.createElement("div");
            actions.className = "task-actions";

            const completeButton = document.createElement("button");
            completeButton.textContent =
                task.completed ? "Undo" : "Complete";

            completeButton.addEventListener("click", function() {
                toggleTask(task.id);
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-button";

            deleteButton.addEventListener("click", function() {
                deleteTask(task.id);
            });

            details.appendChild(title);
            details.appendChild(info);

            actions.appendChild(completeButton);
            actions.appendChild(deleteButton);

            card.appendChild(details);
            card.appendChild(actions);

            taskList.appendChild(card);
        });
    }


    // Mark task as completed or pending
    function toggleTask(id) {

        tasks = tasks.map(function(task) {

            if (task.id === id) {
                task.completed = !task.completed;
            }

            return task;
        });

        saveTasks();
        renderTasks();
        updateDashboard();
    }


    // Delete a task
    function deleteTask(id) {

        const confirmed = confirm("Are you sure you want to delete this task?");

        if (!confirmed) return;

        tasks = tasks.filter(function(task) {
            return task.id !== id;
        });

        saveTasks();
        renderTasks();
        updateDashboard();
    }


    // Update dashboard statistics
    function updateDashboard() {

        const total = tasks.length;

        const completed = tasks.filter(function(task) {
            return task.completed;
        }).length;

        const pending = total - completed;

        const percentage = total === 0
            ? 0
            : Math.round((completed / total) * 100);

        document.getElementById("totalTasks").textContent = total;
        document.getElementById("completedTasks").textContent = completed;
        document.getElementById("pendingTasks").textContent = pending;
        document.getElementById("progressPercent").textContent =
            percentage + "%";

        document.getElementById("progressFill").style.width =
            percentage + "%";

        document.getElementById("progressMessage").textContent =
            total === 0
                ? "Your academic journey starts here."
                : percentage === 100
                    ? "Excellent! All tasks completed."
                    : "Keep going! You're making progress.";
    }


    // Task filters
    filterButtons.forEach(function(button) {

        button.addEventListener("click", function() {

            currentFilter = button.dataset.filter;

            filterButtons.forEach(function(btn) {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            renderTasks();
        });
    });


    // Initial display
    renderTasks();
    updateDashboard();
}
// ==========================================
// CONTACT FORM VALIDATION
// ==========================================

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const phone = document.getElementById("contactPhone").value.trim();
        const message = document.getElementById("contactMessage").value.trim();

        const emailError = document.getElementById("emailError");
        const nameError = document.getElementById("nameError");
        const phoneError = document.getElementById("phoneError");
        const messageError = document.getElementById("messageError");
        const success = document.getElementById("formSuccess");

        // Clear previous messages
        nameError.textContent = "";
        emailError.textContent = "";
        phoneError.textContent = "";
        messageError.textContent = "";
        success.textContent = "";

        let valid = true;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^\d+$/;

        if (!name) {
            nameError.textContent = "Please enter your name.";
            valid = false;
        }

        if (!email) {
            emailError.textContent = "Email is required.";
            valid = false;
        } else if (!emailPattern.test(email)) {
            emailError.textContent = "Please enter a valid email address.";
            valid = false;
        }

        if (!phone) {
            phoneError.textContent = "Phone number is required.";
            valid = false;
        } else if (!phonePattern.test(phone)) {
            phoneError.textContent = "Digits only, please.";
            valid = false;
        }

        if (!message) {
            messageError.textContent = "Please enter a message.";
            valid = false;
        }

        if (valid) {
            success.textContent =
                "Your form has been validated successfully!";

            contactForm.reset();
        }
    });
}

