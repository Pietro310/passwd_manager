// Copia negli appunti
function copyToClipboard(btn, text) {
    // L'API Clipboard moderna funziona solo in HTTPS o su localhost (contesti sicuri)
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text.trim()).then(() => {
            showSuccessIcon(btn);
        }).catch(() => alert('Copia non riuscita.'));
    } else {
        // Fallback per connessioni HTTP normali sul server
        const textArea = document.createElement("textarea");
        textArea.value = text.trim();
        // Nascondi la text area
        textArea.style.position = "absolute";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showSuccessIcon(btn);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
            alert('Copia non riuscita. Il tuo browser blocca la copia in HTTP.');
        } finally {
            document.body.removeChild(textArea);
        }
    }
}

function showSuccessIcon(btn) {
    btn.innerHTML = '<i class="bi bi-check2"></i>';
    setTimeout(() => {
        btn.innerHTML = '<i class="bi bi-copy"></i>';
    }, 1500);
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

// Generatore di password
function generatePassword() {
    const length = parseInt(document.getElementById('genLength').value);
    const incUpper = document.getElementById('genUpper').checked;
    const incLower = document.getElementById('genLower').checked;
    const incNumbers = document.getElementById('genNumbers').checked;
    const incSymbols = document.getElementById('genSymbols').checked;

    const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*-=_+/?";

    let allowedChars = "";
    if (incUpper) allowedChars += upperChars;
    if (incLower) allowedChars += lowerChars;
    if (incNumbers) allowedChars += numberChars;
    if (incSymbols) allowedChars += symbolChars;

    if (allowedChars.length === 0) {
        alert("Seleziona almeno un tipo di carattere!");
        return;
    }

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allowedChars.length);
        generatedPassword += allowedChars[randomIndex];
    }

    document.getElementById('genPasswordOutput').value = generatedPassword;
}

// Copia la password generata
function copyGeneratedPassword(btn) {
    const passwordText = document.getElementById('genPasswordOutput').value;
    if (!passwordText) return;

    // Riutilizziamo la funzione di copia già esistente, ma passiamo il testo esplicito
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(passwordText).then(() => {
            showSuccessIcon(btn.querySelector('i').parentElement); // Il bottone stesso
        }).catch(() => alert('Copia non riuscita.'));
    } else {
        const textArea = document.createElement("textarea");
        textArea.value = passwordText;
        textArea.style.position = "absolute";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showSuccessIcon(btn.querySelector('i').parentElement);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
            alert('Copia non riuscita. Il tuo browser blocca la copia in HTTP.');
        } finally {
            document.body.removeChild(textArea);
        }
    }
}
