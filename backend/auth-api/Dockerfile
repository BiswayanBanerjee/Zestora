# ---------- Stage 1: Build the JAR ----------
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app

# Copy Maven wrapper and project files
COPY pom.xml mvnw ./
COPY .mvn .mvn
COPY src ./src

# Build the project inside the container
RUN ./mvnw clean package -DskipTests

# ---------- Stage 2: Runtime ----------
FROM eclipse-temurin:21-jdk

# Default Render port
# ENV PORT=10000
ENV TRUSTSTORE_PASSWORD=changeit

WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Copy the truststore
COPY src/main/resources/aiven-truststore.jks aiven-truststore.jks

EXPOSE ${PORT}

# Run the Spring Boot app with SSL truststore setup
ENTRYPOINT ["java", "-Djavax.net.ssl.trustStore=/app/aiven-truststore.jks", "-Djavax.net.ssl.trustStorePassword=changeit", "-Djavax.net.ssl.trustStoreType=JKS", "-jar", "app.jar"]
