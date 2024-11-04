import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import apolloGraphqlServer from './graphql';
import cors from 'cors';
import UserService from './services/user';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import { createServer } from 'http';
import socketIo from './socket';

async function mainServer() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;
    const httpServer = createServer(app);

    // Apply global CORS middleware
    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true
    }));

    app.use(cookieParser());
    app.use(express.json());

    app.get('/', (req, res) => {
        res.send("Running");
    });

    const gqlServer = await apolloGraphqlServer();

    app.use('/graphql', expressMiddleware(gqlServer, {
        context: async ({ req, res }) => {
            try {
                const authHeader = req.headers.authorization;
                const token = authHeader && authHeader.split(' ')[1];

                if (token) {
                    const user = await UserService.decodeToken(token as string);
                    if (!user) throw new Error('Invalid or expired token');
                    return { user, req, res, io };
                } else {
                    console.warn('No token provided in request headers.');
                    return { user: null, req, res, io };
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                throw new Error('Authentication failed');
            }
        }
    }));

    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            allowedHeaders: ["Content-Type"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        socketIo(socket, io);
    });

    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

mainServer();
