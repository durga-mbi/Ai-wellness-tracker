import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();
    const [typingUsers, setTypingUsers] = useState([]);

    useEffect(() => {
        const newSocket = io("http://localhost:4000", {
            withCredentials: true
        });

        setSocket(newSocket);

        newSocket.on("typing_update", (users) => {
            setTypingUsers(users);
        });

        return () => newSocket.close();
    }, []);

    const startTyping = (isAnonymous) => {
        if (socket && user) {
            socket.emit("typing_start", {
                userId: user.id,
                name: user.name,
                isAnonymous
            });
        }
    };

    const stopTyping = () => {
        if (socket) {
            socket.emit("typing_stop");
        }
    };

    return (
        <SocketContext.Provider value={{ socket, typingUsers, startTyping, stopTyping }}>
            {children}
        </SocketContext.Provider>
    );
};
