# ---- BUILD STAGE ----
FROM maven:3.9.8-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# ---- RUNTIME STAGE ----
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /app/target/login-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]