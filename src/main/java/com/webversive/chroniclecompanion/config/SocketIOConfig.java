package com.webversive.chroniclecompanion.config;

import com.webversive.chroniclecompanion.service.OnlineService;
import com.webversive.chroniclecompanion.socketio.SocketWrapper;
import io.socket.socketio.server.SocketIoNamespace;
import io.socket.socketio.server.SocketIoServer;
import io.socket.socketio.server.SocketIoSocket;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class SocketIOConfig {

    private final OnlineService onlineService;

    public SocketIOConfig(OnlineService onlineService) {
        this.onlineService = onlineService;
    }

    @Bean
    public SocketWrapper getSocketWrapper() {
        final SocketWrapper socketWrapper = new SocketWrapper("127.0.0.1", 9092, null);
        try {
            socketWrapper.startServer();
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
        SocketIoServer server = socketWrapper.getSocketIoServer();
        SocketIoNamespace namespace = server.namespace("/");

        namespace.on("connection", args1 -> {
            SocketIoSocket socket = (SocketIoSocket) args1[0];
            log.info("Client " + socket.getId() + " (" + socket.getInitialHeaders().get("remote_addr") + ") has connected.");

            socket.on("register", args11 -> {
                log.info("TOKEN REGISTRATION REQUEST RECEIVED");
                socket.send("registration request received", socket.getId());
            });

            socket.on("token registered", args11 -> {
                log.info("TOKEN REGISTERED RECEIVED");
                namespace.broadcast(null, "update online");
            });

            socket.on("roll", args -> {
                log.info("ROLL RESULT RECEIVED: {}", args);
                namespace.broadcast((String) null, "roll results", args);
            });

            socket.on("disconnect", args111 -> {
                log.info("[Client {}], {}", socket.getId(), args111);
                onlineService.removeToken(socket.getId());
                namespace.broadcast(null, "update online");
            });

        });

        return socketWrapper;
    }
}
