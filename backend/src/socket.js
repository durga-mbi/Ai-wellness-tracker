import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: true, // Reflect all origins
            credentials: true,
            methods: ["GET", "POST"]
        }
    });

    const typingUsers = new Map();

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("typing_start", (data) => {
            // data: { userId, name, isAnonymous }
            typingUsers.set(socket.id, data);
            socket.broadcast.emit("typing_update", Array.from(typingUsers.values()));
        });

        socket.on("typing_stop", () => {
            typingUsers.delete(socket.id);
            socket.broadcast.emit("typing_update", Array.from(typingUsers.values()));
        });

        socket.on("disconnect", () => {
            typingUsers.delete(socket.id);
            io.emit("typing_update", Array.from(typingUsers.values()));
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

export const emitEvent = (event, data) => {
    if (io) {
        io.emit(event, data);
    }
};
