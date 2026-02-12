// =====================
// CONSTANTS & VARIABLES
// =====================
const API_URL = '/api/todos'; // Vercel automatically serve karega
let todos = [];         // Sare todos yaha store honge
let currentPage = 1;    // Pagination ke liye current page
const rowsPerPage = 10; // Ek page me kitne todos dikhaye jaenge

// =====================
// WINDOW ONLOAD
// =====================
window.onload = getTodos; // Page load hote hi todos fetch karo
function getTodos() {
    const search = document.getElementById('searchInput').value;
    const date = document.getElementById('dateFilter').value;

    let url = API_URL + '?';
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (date) url += `date=${date}`;

    fetch(url)
        .then(res => res.json())
        .then(response => {

            currentPage = 1;              // Pagination reset
            todos = response.data;        // ✅ YAHI FIX HAI

            if (!todos || todos.length === 0) {
                document.getElementById('todoList').innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center text-danger">
                            No records found
                        </td>
                    </tr>
                `;
                document.getElementById('pagination').innerHTML = '';
                return;
            }

            renderTable();
            renderPagination();
        })
        .catch(() => {
            showMessage('danger', '❌ Todos fetch nahi huye');
        });
}

// =====================
// RENDER TABLE WITH PAGINATION
// =====================
function renderTable() {
    const list = document.getElementById('todoList');
    list.innerHTML = ''; // Table clear kar rahe hain

    // Pagination logic
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageTodos = todos.slice(start, end); // Current page ke todos

    // Todos display kar rahe hain
    pageTodos.forEach((todo, index) => {
        list.innerHTML += `
            <tr>
                <td>${start + index + 1}</td> <!-- Serial number -->

                <!-- TODO TEXT & INPUT -->
                <td>
                    <span id="text-${todo.id}">${todo.title}</span>
                    <input type="text"
                        class="form-control form-control-sm d-none"
                        id="input-${todo.id}"
                        value="${todo.title}">
                </td>

                <td>${formatDate(todo.created_at)}</td>
                <td>${formatDate(todo.updated_at)}</td>

                <!-- ACTION BUTTONS -->
                <td>
                    <!-- EDIT -->
                    <button class="btn btn-warning btn-sm"
                        id="edit-${todo.id}"
                        onclick="editTodo(${todo.id})">✏️</button>

                    <!-- SAVE -->
                    <button class="btn btn-success btn-sm d-none"
                        id="save-${todo.id}"
                        onclick="saveTodo(${todo.id})">💾</button>

                    <!-- CANCEL -->
                    <button class="btn btn-secondary btn-sm d-none"
                        id="cancel-${todo.id}"
                        onclick="cancelEdit(${todo.id})">❌</button>

                    <!-- DELETE -->
                    <button class="btn btn-danger btn-sm"
                        onclick="deleteTodo(${todo.id})">🗑</button>
                </td>
            </tr>
        `;
    });
}

// =====================
// EDIT MODE
// =====================
function editTodo(id) {
    document.getElementById(`text-${id}`).classList.add('d-none');   // Text hide karo
    document.getElementById(`input-${id}`).classList.remove('d-none'); // Input show karo

    document.getElementById(`edit-${id}`).classList.add('d-none');   // Edit button hide
    document.getElementById(`save-${id}`).classList.remove('d-none'); // Save show
    document.getElementById(`cancel-${id}`).classList.remove('d-none'); // Cancel show
}

// =====================
// CANCEL EDIT
// =====================
function cancelEdit(id) {
    document.getElementById(`text-${id}`).classList.remove('d-none');   // Text show
    document.getElementById(`input-${id}`).classList.add('d-none');     // Input hide

    document.getElementById(`edit-${id}`).classList.remove('d-none');   // Edit show
    document.getElementById(`save-${id}`).classList.add('d-none');      // Save hide
    document.getElementById(`cancel-${id}`).classList.add('d-none');    // Cancel hide
}

// =====================
// SAVE / UPDATE TODO
// =====================
function saveTodo(id) {
    const newTitle = document.getElementById(`input-${id}`).value.trim();

    const wordCount = newTitle.split(/\s+/).filter(w => w).length;

    if (wordCount > 50) {
        showMessage('danger', '❌ Todo 50 words se zyada nahi ho sakta');
        return;
    }

    if (!newTitle) {
        showMessage('danger', 'Todo empty nahi ho sakta');
        return;
    }

    fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle })
    })
    .then(res => res.json())
    .then(() => {
        showMessage('success', '✏️ Todo updated successfully');
        getTodos();
    });
}

// =====================
// ADD TODO
// =====================
function addTodo() {
    const titleInput = document.getElementById('title');
    const title = titleInput.value.trim();

    // 🔒 WORD LIMIT CHECK (50 words)
    const wordCount = title.split(/\s+/).filter(w => w).length;

    if (wordCount > 10) {
        showMessage('danger', '❌ Todo 10 words se zyada nahi ho sakta');
        return;
    }

    if (!title) {
        showMessage('danger', 'Todo empty nahi ho sakta');
        return;
    }

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
    })
    .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
    })
    .then(() => {
        titleInput.value = '';
        showMessage('success', '✅ Todo created successfully');
        getTodos();
    })
    .catch(() => {
        showMessage('danger', '❌ Todo create nahi hua');
    });
}

// =====================
// DELETE TODO
// =====================
function deleteTodo(id) {
    if (!confirm("Delete karna hai?")) return;

    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then(() => {
            showMessage('success', '🗑 Todo deleted successfully');
            getTodos(); // Refresh list aur pagination
        })
        .catch(() => {
            showMessage('danger', '❌ Todo delete nahi hua');
        });
}

// =====================
// PAGINATION
// =====================
function renderPagination() {
    const totalPages = Math.ceil(todos.length / rowsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <button class="page-link" onclick="goToPage(${i})">${i}</button>
            </li>
        `;
    }
}

// Page switch karne ke liye
function goToPage(page) {
    currentPage = page;
    renderTable();       // Table update
    renderPagination();  // Pagination update
}

// =====================
// HELPER FUNCTIONS
// =====================
function formatDate(dateString) {
    if (!dateString) return '-';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB') + ' ' + d.toLocaleTimeString();
}

// Alert messages show karne ke liye
function showMessage(type, message) {
    const alertBox = document.getElementById('alertBox');

    alertBox.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    // 5 second me auto hide
    setTimeout(() => {
        alertBox.innerHTML = '';
    }, 5000);
}

// Enter key press par search
function handleEnter(e) {
    if (e.key === "Enter") {
        getTodos();
    }
}

// Filters clear karne ke liye
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('dateFilter').value = '';
    currentPage = 1; // Reset page
    getTodos();
}


function updateWordCount() {
    const input = document.getElementById('title');
    const counter = document.getElementById('wordCounter');

    const words = input.value.trim()
        ? input.value.trim().split(/\s+/).filter(w => w).length
        : 0;

    counter.innerText = `Words: ${words} / 50`;

    // Limit cross ho to red color
    if (words > 50) {
        counter.classList.remove('text-muted');
        counter.classList.add('text-danger');
    } else {
        counter.classList.remove('text-danger');
        counter.classList.add('text-muted');
    }
}
