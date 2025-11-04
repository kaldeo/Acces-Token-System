const jwt = require('jsonwebtoken');

function generateToken(login, pwd) {
    const user = { login, pwd };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token generated:', token, 'for user:', user);
    return token;
}

function Connection() {
    const UserData = {
        login: "admin",
        pwd: "password"
    }
    const token = generateToken(UserData.login, UserData.pwd);
    if (token) {
        console.log('User connected:', UserData.login);
    }
    else {
        console.log('User connection failed');
    }
}

module.exports = { generateToken, Connection };