//package com.example.signaling.controller;
//
//import com.example.signaling.dto.MessageRequestDto;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Controller;
//
//@Controller
//@Slf4j
//@RequiredArgsConstructor
//public class ChatController {
//
//    private final SimpMessagingTemplate template;
//
//    @MessageMapping("/chat/enter")
//    public void enter(MessageRequestDto message){
//        message.setMessage(message.getWriter() + "님이 채팅방에 참여하였습니다.");
//        template.convertAndSend("/sub/chat/room/" + message.getRoomId(), message);
//    }
//
//    @MessageMapping("/chat/message")
//    public void message(MessageRequestDto message){
//        template.convertAndSend("/sub/chat/room/" + message.getRoomId(), message);
//    }
//}
