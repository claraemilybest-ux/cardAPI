const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const users = [
    { id: 1, username: 'user1', password: 'pass1' },
    { id: 2, username: 'user2', password: 'pass2' }
];
const secret = 'your_jwt_secret';

app.post('/getToken', (req, res) => {
    const { username, password } = req.body;
    const user = users.find((user) => user.username === username);
    if (!user || user.password !== password){
        return res.status(401).json({ message: 'Invalid credentials' }, );
    }

    const token = jwt.sign({id: user.id}, secret, { 
        algorithm: 'HS256', 
        expiresIn: '2h'
    });
    return res.json({token: token});
});