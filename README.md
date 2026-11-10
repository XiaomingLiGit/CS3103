# TripLab — CS3103 Full-Stack HTTP Teaching Demo

This is the **upgraded version** of the Trip API used in the University of New Brunswick CS3103 *Programming on the Web* teaching presentation.

**It includes both frontend and backend in one Spring Boot application.** No React setup and no second web server are needed.

## What you will see

- A modern browser interface displaying **all trips** (`GET /api/trips`).
- **Inspect one trip** (`GET /api/trips/101` → `200 OK`).
- **Look up a missing trip** (`GET /api/trips/999` → `404 Not Found`).
- **Create a trip** by submitting a form (`POST /api/trips` → `201 Created`, with a `Location` header).
- **Submit invalid data** (`POST /api/trips` → `400 Bad Request`).
- A live **HTTP Inspector** showing request method, URL, request headers/body, response status, response headers/body and elapsed time.
- A **Reset demo** button to restore sample trips for the next teaching run.

## Requirements

1. **JDK 21** (verify with `java -version`).
2. **Maven 3.9+** (verify with `mvn -version`), or IntelliJ IDEA with Maven support.
3. Internet access **on the first build** so Maven can download Spring dependencies. The frontend itself uses no CDN.


**Alternative: terminal in the project root**

```bash
mvn spring-boot:run
```

Stop with `Ctrl+C` or the IDE Stop button.

> If port 8080 is taken, run `mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081` and open http://localhost:8081/ instead.

## Where the frontend is

```text
UNB_CS3103_TripLab_Upgraded/
├── pom.xml                            Maven project
├── src/main/java/ca/unb/cs3103/       BACKEND (Java)
│   ├── TripApiApplication.java         Spring Boot entry point
│   ├── TripController.java             REST API endpoints (GET/POST)
│   ├── TripService.java                In-memory business/data layer
│   ├── DemoController.java             Reset button endpoint
│   ├── Trip.java                        Response JSON record
│   ├── NewTrip.java                     POST request JSON record
│   └── ApiError.java                    Error response JSON record
├── src/main/resources/static/          FRONTEND (browser)
│   ├── index.html                      Page markup
│   ├── styles.css                      UI design
│   └── app.js                          fetch(), DOM updates, HTTP inspector
└── src/test/java/ca/unb/cs3103/
    └── TripApiApplicationTests.java    HTTP integration tests
```


