package com.example.signaling.config;

import org.kurento.client.KurentoClient;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class KurentoUtil {

    @Bean
    public KurentoClient kurentoClient() {
        return KurentoClient.create();
    }
}
