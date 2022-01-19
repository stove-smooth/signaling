package com.example.signaling.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageRequestDto {
    private String roomId;
    private String writer;
    private String message;
}
