FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Copy the packaged Spring Boot WAR/JAR file to the container
COPY target/EduPlus-0.0.1-SNAPSHOT.jar app.jar

# Expose port (adjust to your backend port)
EXPOSE 5000

# Run the backend
ENTRYPOINT ["java", "-jar", "app.jar"]
