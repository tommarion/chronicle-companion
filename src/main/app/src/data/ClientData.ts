import {Client} from "stompjs";

export interface ClientData {
    stompClient:    Client
    userSessionId:  string
}