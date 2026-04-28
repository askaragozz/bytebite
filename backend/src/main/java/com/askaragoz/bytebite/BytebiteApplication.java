package com.askaragoz.bytebite;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class BytebiteApplication {

    public static void main(String[] args) {
        SpringApplication.run(BytebiteApplication.class, args);
    }

}
