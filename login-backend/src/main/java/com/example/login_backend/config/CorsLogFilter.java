package com.example.login_backend.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class CorsLogFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        chain.doFilter(request, response);

        HttpServletResponse httpResponse = (HttpServletResponse) response;
        System.out.println("=== CORS HEADERS ===");
        System.out.println("Access-Control-Allow-Origin: " + httpResponse.getHeader("Access-Control-Allow-Origin"));
        System.out.println("Access-Control-Allow-Credentials: " + httpResponse.getHeader("Access-Control-Allow-Credentials"));
        System.out.println("====================");
    }
}