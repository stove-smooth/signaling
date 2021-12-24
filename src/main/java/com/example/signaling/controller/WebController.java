package com.example.signaling.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping
    public String home() {
        return "home";
    }

    @GetMapping("/video")
    public String video() { return "video"; }

    @GetMapping("/video2")
    public String video2() { return "video2"; }
}
