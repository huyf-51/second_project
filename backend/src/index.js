const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();
const { connectDB } = require('./config/db');
const app = express();
const initRoutes = require('../src/routes/index');
const errorController = require('../src/controllers/ErrorController');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
const redis = require("./config/redis").getRedisInstance('redis://127.0.0.1:6379')
const client = redis.getRedisClient()
const socketIO = require('./config/socket')

const redisClient = createClient();
const redisStore = new RedisStore({
    client: client,
    ttl: 3600 * 24 * 1000,
});

redisClient.connect().catch(console.error);
socketIO()

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true,
    })
);
app.use(
    session({
        cookie: {
            maxAge: 3600 * 24 * 1000,
        },
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        name: 'sessionID',
        store: redisStore,
    })
);
app.use(express.json());

connectDB();
initRoutes(app);
app.use(errorController);

app.listen(3000, () => {
    console.log('app listen on port 3000');
});
