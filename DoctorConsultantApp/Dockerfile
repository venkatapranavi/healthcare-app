# Use an official Maven image to build the Spring Boot app
FROM maven:3.8.4-openjdk-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Use an official OpenJDK image to run the application
FROM openjdk:17-jdk-slim

# Set working directory for runtime container
WORKDIR /app

# Copy the JAR from the build stage
COPY --from=build /app/target/DoctorConsultantApp-0.0.1-SNAPSHOT.jar .

# Expose port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "/app/DoctorConsultantApp-0.0.1-SNAPSHOT.jar"]