package com.webversive.chroniclecompanion.config;

import com.webversive.chroniclecompanion.service.OnlineService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import org.springframework.web.socket.handler.WebSocketHandlerDecorator;

@Configuration
@EnableWebSocketMessageBroker
@Slf4j
public class SocketBrokerConfig implements WebSocketMessageBrokerConfigurer {

    private final OnlineService onlineService;

    public SocketBrokerConfig(OnlineService onlineService) {
        this.onlineService = onlineService;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/secured");
        config.setApplicationDestinationPrefixes("/socket");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/secured/")
                .withSockJS();
    }

    @Override
    public void configureWebSocketTransport(final WebSocketTransportRegistration registration) {
        registration.addDecoratorFactory(handler -> new WebSocketHandlerDecorator(handler) {
//            @Override
//            public void afterConnectionEstablished(final WebSocketSession session) throws Exception {
//                log.info("Client {} connected", session.getId());
//                if (nonNull(session.getPrincipal())) {
//                    String accountName = session.getPrincipal().getName();
//                    onlineService.addTokenToSocketData(session.getId(), OnlineData.builder()
//                                    .characterId(accountService.getCharacterIdForUsername(accountName, ))
//                            .build());
//                    log.info(session.getPrincipal().getName());
//                }
//                super.afterConnectionEstablished(session);
//            }

//            @Override
//            public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
//                if (message.getPayload().toString().startsWith("CONNECT")) {
//                    session.getAcceptedProtocol();
//                }
//                if (session.isOpen()){
//                    super.handleMessage(session, message);
//                } else {
//                    log.info("Dropped inbound WebSocket message due to closed session");
//                }
//            }

            @Override

            public void afterConnectionClosed(final WebSocketSession session, CloseStatus closeStatus)
                    throws Exception {
                log.info("Client {} disconnected", session.getId());
                String campaignId = onlineService.removeToken(session.getId());
//                brokerMessagingTemplate.convertAndSend("/secured/campaign/" + campaignId + "/online/update",
//                        new SocketOutputMessage(new SimpleDateFormat("HH:mm").format(new Date())));
                super.afterConnectionClosed(session, closeStatus);
            }
        });
    }
}
