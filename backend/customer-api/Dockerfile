# ---------- Stage 1: Build ----------
FROM eclipse-temurin:21-jdk AS builder

# Set working directory inside the container
WORKDIR /app

# Copy Maven wrapper and project files
COPY pom.xml mvnw ./
COPY .mvn .mvn
COPY src ./src

# Give execute permission to Maven wrapper (fixes permission denied)
RUN chmod +x mvnw

# Build the Spring Boot JAR inside Docker (skip tests for speed)
RUN ./mvnw clean package -DskipTests


# ---------- Stage 2: Runtime ----------
FROM eclipse-temurin:21-jdk

# Environment variable for port (Render sets this automatically)
ENV PORT=10000

# Set working directory
WORKDIR /app

# Copy only the final JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the port (Render detects this automatically)
EXPOSE ${PORT}

# Command to run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
