# ---------- Stage 1: Build the JAR ----------
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app

COPY pom.xml mvnw ./
COPY .mvn .mvn
COPY src ./src

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# ---------- Stage 2: Runtime ----------
FROM eclipse-temurin:21-jdk

ENV TRUSTSTORE_PASSWORD=changeit
# ENV PORT=10000

WORKDIR /app

# Copy JAR
COPY --from=builder /app/target/*.jar app.jar

# Copy truststore
COPY src/main/resources/aiven-truststore.jks /app/aiven-truststore.jks

# Copy Firebase JSON (important!)
# COPY src/main/resources/zestora-dc0ed-firebase-adminsdk-fbsvc-8cd225cfc3.json /app/zestora-firebase.json

EXPOSE ${PORT}

# Run the Spring Boot app with SSL truststore setup
ENTRYPOINT ["java", "-jar", "app.jar"]
