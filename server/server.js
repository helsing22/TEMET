const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Datos de usuarios (puedes expandir esto para incluir más cadetes)
let usuarios = {
    teniente: { username: 'admin', password: 'password', monedas: Infinity, tareas: [] },
};

// Ruta para iniciar sesión
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const usuario = usuarios[username];
    
    if (usuario && usuario.password === password) {
        return res.json({ success: true, message: 'Inicio de sesión exitoso', user: usuario });
    }
    return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
});

// Ruta para registrar un nuevo cadete
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    // Validar que el nombre de usuario y la contraseña no estén vacíos
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'El nombre de usuario y la contraseña son obligatorios' });
    }

    // Verificar si el usuario ya existe
    if (usuarios[username]) {
        return res.status(400).json({ success: false, message: 'El usuario ya existe' });
    }

    // Registrar el nuevo cadete
    usuarios[username] = { username, password, monedas: 100, tareas: [] }; // Monedas iniciales
    return res.json({ success: true, message: 'Cadete registrado exitosamente' });
});

// Ruta para asignar tareas a un cadete
app.post('/api/tareas/asignar', (req, res) => {
    const { username, tarea } = req.body;

    // Validar que el nombre de usuario y la tarea no estén vacíos
    if (!username || !tarea) {
        return res.status(400).json({ success: false, message: 'El nombre de usuario y la tarea son obligatorios' });
    }

    // Verificar si el cadete existe
    if (!usuarios[username]) {
        return res.status(404).json({ success: false, message: 'Cadete no encontrado' });
    }

    // Asignar la tarea
    usuarios[username].tareas.push(tarea);
    return res.json({ success: true, message: 'Tarea asignada exitosamente' });
});

// Ruta para obtener todas las tareas de un cadete
app.get('/api/tareas/:username', (req, res) => {
    const { username } = req.params;

    // Verificar si el cadete existe
    if (!usuarios[username]) {
        return res.status(404).json({ success: false, message: 'Cadete no encontrado' });
    }

    // Devolver las tareas del cadete
    return res.json({ tareas: usuarios[username].tareas });
});

// Ruta para obtener la lista de cadetes
app.get('/api/cadetes', (req, res) => {
    const cadetes = Object.values(usuarios).filter(user => user.username !== 'teniente');
    return res.json(cadetes);
});

// Ruta para intercambiar monedas entre cadetes
app.post('/api/intercambiar', (req, res) => {
    const { de, a, cantidad } = req.body;

    // Validar que los nombres de usuario y la cantidad no estén vacíos
    if (!de || !a || !cantidad) {
        return res.status(400).json({ success: false, message: 'Los campos de usuario y cantidad son obligatorios' });
    }

    // Verificar si los cadetes existen
    if (!usuarios[de] || !usuarios[a]) {
        return res.status(404).json({ success: false, message: 'Cadete no encontrado' });
    }

    // Verificar si el cadete que envía tiene suficientes monedas
    if (usuarios[de].monedas < cantidad) {
        return res.status(400).json({ success: false, message: 'No tienes suficientes monedas' });
    }

    // Realizar el intercambio
    usuarios[de].monedas -= cantidad;
    usuarios[a].monedas += cantidad;
    return res.json({ success: true, message: 'Intercambio realizado exitosamente' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
