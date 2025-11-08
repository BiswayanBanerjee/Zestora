package com.FoodieApp.RegisteredUser;

import com.FoodieApp.RegisteredUser.filter.JWTFilter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@SpringBootApplication
public class RegisteredUserApplication {

	public static void main(String[] args) {
		SpringApplication.run(RegisteredUserApplication.class, args);
		System.out.println("Application Started.........");
}

//		@Bean
//		public FilterRegistrationBean filterBean()
//	{
//			FilterRegistrationBean frb = new FilterRegistrationBean();
//			frb.setFilter(new JWTFilter());
//			frb.addUrlPatterns("/customer/profile", "/customer/query", "/customer/orders");
//			return frb;
//		}
		@Bean
		public FilterRegistrationBean filterRegistrationBean () {
			final CorsConfiguration config = new CorsConfiguration();
			config.setAllowCredentials(true);
			config.setAllowedOrigins(List.of(
            "http://localhost:5173",
            "https://zestora-9kan.onrender.com" // ← your Render frontend URL
        ));
			config.addAllowedHeader("*");
			config.addAllowedMethod("*");
			final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
			source.registerCorsConfiguration("/**", config);
			FilterRegistrationBean bean = new FilterRegistrationBean(new CorsFilter(source));
			bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
			return bean;
		}

}
