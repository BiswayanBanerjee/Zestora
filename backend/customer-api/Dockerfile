# ---------- Stage 1: Build the JAR ----------
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app

# Copy Maven wrapper and project files
COPY pom.xml mvnw ./
COPY .mvn .mvn
COPY src ./src

# Give execute permission to mvnw
RUN chmod +x mvnw

# Build the project inside Docker
RUN ./mvnw clean package -DskipTests

# ---------- Stage 2: Runtime ----------
FROM eclipse-temurin:21-jdk
WORKDIR /app

# Copy built JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

EXPOSE ${PORT:-8084}

ENTRYPOINT ["java", "-jar", "app.jar"]
