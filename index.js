const express = require('express');
const jwt = require('jsonwebtoken');
const { expressjwt } = require('express-jwt');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.json());

const CARDS_FILE = path.join(__dirname, 'cards.json');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const PORT = process.env.PORT ||3000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Kill the process using that port or set PORT to a free port.`);
        process.exit(1);
    }
   console.error('Server error:', err);
   process.exit(1);
});

const auth = expressjwt({ secret: JWT_SECRET, algorithms: ['HS256'] });
const users = [
    { 
        id: 1, 
        username: "user1", 
        password: "pass1" 
    },
    { 
        id: 2, 
        username: "user2", 
        password: "pass2"
    }
];



app.post('/getToken', (req, res) => {
    console.log("token request:", req.body);
    const { username, password } = req.body || {};
    if (!username || !password) {
        return res.status(400).json({ message: 'username and password required' });
    }
    const user = users.find((user) => user.username === username);
    console.log(user);
    if (!user || user.password !== password){
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({id: user.id}, JWT_SECRET, { 
        algorithm: 'HS256', 
        expiresIn: '2h'
    });
    return res.json({ token });
});



