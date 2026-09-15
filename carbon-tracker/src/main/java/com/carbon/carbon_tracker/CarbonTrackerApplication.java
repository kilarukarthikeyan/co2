package com.carbon.carbon_tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CarbonTrackerApplication {

	public static void main(String[] args) {
		SpringApplication.run(CarbonTrackerApplication.class, args);
	}

}
