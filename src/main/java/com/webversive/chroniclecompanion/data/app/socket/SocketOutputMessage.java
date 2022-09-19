package com.webversive.chroniclecompanion.data.app.socket;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class SocketOutputMessage extends SocketMessage {
    private String time;

    public SocketOutputMessage(final String time) {
        this.time = time;
    }

    public String getTime() {
        return time;
    }
    public void setTime(String time) { this.time = time; }
}
