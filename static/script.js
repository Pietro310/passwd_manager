// Copia negli appunti
function copyToClipboard(btn, text) {
    navigator.clipboard.writeText(text.trim()).then(() => {
        btn.innerHTML = '<i class="bi bi-check2"></i>';
        setTimeout(() => {
            btn.innerHTML = '<i class="bi bi-copy"></i>';
        }, 1500);
    }).catch(() => alert('Copia non riuscita'));
}

// Aggiunta di una nuova password
function addPassword() {
    const email = document.getElementById('addEmail').value;
    const username = document.getElementById('addUsername').value;
    const password = document.getElementById('addPassword').value;
    const note = document.getElementById('addNote').value;

    fetch('/api/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, username, password, note })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                window.location.reload(); // Ricarica per vedere i nuovi dati
            } else {
                alert('Errore: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Eliminazione di una password
let pendingDeleteId = null;

function deletePassword(id) {
    pendingDeleteId = id;
    const modalEl = document.getElementById('deleteModal');
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

function confirmDelete() {
    if (pendingDeleteId === null) return;

    const modalEl = document.getElementById('deleteModal');
    bootstrap.Modal.getOrCreateInstance(modalEl).hide();

    fetch(`/api/delete/${pendingDeleteId}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                window.location.reload();
            } else {
                alert('Errore: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error))
        .finally(() => { pendingDeleteId = null; });
}

// Apertura del modale di Modifica con i dati precompilati
function openEditModal(id, email, username, password, note) {
    document.getElementById('editId').value = id;
    document.getElementById('editEmail').value = email;
    document.getElementById('editUsername').value = username;
    document.getElementById('editPassword').value = password;
    document.getElementById('editNote').value = note;

    // Mostra il modale usando l'API di Bootstrap
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
}

// Aggiornamento di una password esistente
function updatePassword() {
    const id = document.getElementById('editId').value;
    const email = document.getElementById('editEmail').value;
    const username = document.getElementById('editUsername').value;
    const password = document.getElementById('editPassword').value;
    const note = document.getElementById('editNote').value;

    fetch(`/api/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, username, password, note })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                window.location.reload();
            } else {
                alert('Errore: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Ricerca in tempo reale nella tabella
function searchTable() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toLowerCase();
    const table = document.querySelector(".table");
    const tr = table.getElementsByTagName("tr");

    // Inizia dal ciclo 1 per saltare l'intestazione della tabella (thead)
    for (let i = 1; i < tr.length; i++) {
        let textValue = tr[i].textContent || tr[i].innerText;
        if (textValue.toLowerCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}
