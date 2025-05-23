package backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors()  // Enable CORS
                .and()
                .csrf().disable()  // Disable CSRF (for APIs)
                .authorizeHttpRequests()
                .anyRequest().permitAll() // 💥 Permit ALL requests without authentication
                .and()
                .httpBasic().disable() // Disable HTTP Basic auth
                .formLogin().disable(); // Disable Form login

        return http.build();
    }
}
