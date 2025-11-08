# Start from a lightweight OpenJDK base image
FROM eclipse-temurin:21-jdk

# Environment variable for port (Render will provide this)
# ENV PORT=10000

# Set working directory inside the container
WORKDIR /app

# Copy the JAR file built by Maven into the container
COPY target/*.jar app.jar

# Expose the port
EXPOSE ${PORT}

# Command to run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
