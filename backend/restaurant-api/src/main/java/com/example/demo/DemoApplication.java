package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Bean
    public FilterRegistrationBean<CorsFilter> filterRegistrationBean() {
        final CorsConfiguration config = new CorsConfiguration();

        // ✅ Allow credentials and specific origins
        config.setAllowCredentials(true);
        config.setAllowedOriginPatterns(List.of(
        "http://localhost:5173",
        "https://zestora-9kan.onrender.com"
    ));

        // ✅ Allow headers and methods
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        // ✅ Optional but recommended for newer browsers:
        config.addExposedHeader("Authorization");

        // ✅ Register the CORS configuration
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }
}
