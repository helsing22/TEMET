document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        const loginMessage = document.getElementById('loginMessage');
        if (data.success) {
            loginMessage.textContent = 'Inicio de sesión exitoso';
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('registerSection').style.display = 'none';
            document.getElementById('taskSection').style.display = 'block';
            cargarCadetes(); // Cargar cadetes después de iniciar sesión
            if (username === 'admin') {
                document.getElementById('tareaForm').style.display = 'block';
            }
        } else {
            loginMessage.textContent = 'Credenciales incorrectas';
        }
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: newUsername, password: newPassword })
    })
    .then(response => response.json())
    .then(data => {
        const registerMessage = document.getElementById('registerMessage');
        if (data.success) {
            registerMessage.textContent = 'Cadete registrado exitosamente';
            document.getElementById('registerForm').reset();
        } else {
            registerMessage.textContent = data.message;
        }
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('tareaForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const descripcion = document.getElementById('descripcion').value;
    const cadeteAsignar = document.getElementById('cadeteAsignar').value;
    const nuevaTarea = {
        descripcion: descripcion,
        estado: 'Pendiente'
    };

    fetch('/api/tareas/asignar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: cadeteAsignar, tarea: nuevaTarea })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Tarea asignada exitosamente');
            document.getElementById('tareaForm').reset();
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});

function cargarCadetes() {
    fetch('/api/cadetes')
        .then(response => response.json())
        .then(cadetes => {
            const cadetesList = document.getElementById('cadetesList');
            cadetesList.innerHTML = '';
            cadetes.forEach(cadete => {
                const li = document.createElement('li');
                li.textContent = `${cadete.username} - Monedas: ${cadete.monedas}`;
                cadetesList.appendChild(li);
            });
        })
        .catch(error => console.error('Error:', error));
}

document.getElementById('intercambioForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const cadeteDe = document.getElementById('cadeteDe').value;
    const cadeteA = document.getElementById('cadeteA').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);

    fetch('/api/intercambiar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ de: cadeteDe, a: cadeteA, cantidad: cantidad })
    })
    .then(response => response.json())
    .then(data => {
        const intercambioMessage = document.getElementById('intercambioMessage');
        if (data.success) {
            intercambioMessage.textContent = 'Intercambio realizado exitosamente';
            document.getElementById('intercambioForm').reset();
        } else {
            intercambioMessage.textContent = data.message;
        }
    })
    .catch(error => console.error('Error:', error));
});

// Mostrar y ocultar secciones
document.getElementById('showRegisterButton').addEventListener('click', function() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'block';
});

document.getElementById('showLoginButton').addEventListener('click', function() {
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
});
