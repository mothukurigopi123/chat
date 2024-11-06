// server.js
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chatDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/chat', async (req, res) => {
    const messages = await Message.find().sort({ timestamp: -1 }).limit(10);
    res.render('chat', { messages: messages.reverse() });
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('newMessage', async (data) => {
        const message = new Message({
            username: data.username,
            message: data.message,
            description: data.description,
            price: data.price,
            rating: data.rating,
            image: data.image
        });
        await message.save();
        io.emit('newMessage', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
