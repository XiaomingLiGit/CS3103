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

## How to launch (Windows / IntelliJ IDEA)

1. Unzip the folder `UNB_CS3103_TripLab_Upgraded`.
2. Start IntelliJ IDEA → **Open** → select the folder (or `pom.xml`), and trust the project.
3. Set project **SDK to Java 21**. Wait for Maven dependencies to load.
4. Open `src/main/java/ca/unb/cs3103/TripApiApplication.java` and press **Run** beside `main()`.
5. When startup finishes, open **http://localhost:8080/** in your browser. **Do not double-click `index.html`**; Spring Boot must serve it.

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

**Why one project?** Spring Boot automatically serves files from `src/main/resources/static/`. The browser fetches `/api/trips` from the same host and port, avoiding CORS configuration while teaching the fundamental HTTP cycle.

## Suggested 5–7 minute live demonstration

| Action in browser | HTTP exchange | Teaching point |
|---|---|---|
| Page loads / Refresh | `GET /api/trips` → `200 OK` | JSON array & resources |
| Click **Found** / inspect 101 | `GET /api/trips/101` → `200 OK` | Path variable, JSON object |
| Click **Not found** | `GET /api/trips/999` → `404 Not Found` | Client reached server; resource absent |
| Enter Origin + Destination; click **Create trip** | `POST /api/trips` → `201 Created` | Request JSON, new ID, `Location` response header |
| Click **Invalid data** | `POST /api/trips` → `400 Bad Request` | Backend validation & structured JSON errors |
| Click **Reset demo** | `POST /api/demo/reset` → `200 OK` | Restore starting state (demo-only endpoint) |

See `TEACHING_DEMO_SCRIPT.md` for spoken transitions and follow-up questions.

## Call the API directly

On Windows PowerShell, use `curl.exe` instead of `curl` if it is aliased to a PowerShell command:

```bash
curl.exe -i http://localhost:8080/api/trips
curl.exe -i http://localhost:8080/api/trips/101
curl.exe -i http://localhost:8080/api/trips/999
curl.exe -i -X POST http://localhost:8080/api/trips -H "Content-Type: application/json" -d "{\"origin\":\"Moncton\",\"destination\":\"Fredericton\"}"
```

Or copy the **HTTP request** fields from the inspector and compare them with the browser's **DevTools → Network** panel.

## Test the backend

```bash
mvn test
```

Tests cover list (200), single trip (200), missing trip (404), create (201 & Location), invalid create (400), reset, and static frontend.

## Class discussion / mini assignment

1. Why does `GET` normally have **no request body**, while `POST` carries JSON?
2. Which HTTP status indicates that a **new resource was created**? Which response header points to it?
3. What is the difference between **404 Not Found** and a **network error**?
4. Modify the app to add `GET /api/trips?origin=Montreal` (filtering by origin) and describe how the frontend would change.

## Important limitations

- This is a classroom demo, **not production software**: there is no authentication or persistent database.
- Trips are stored in memory; restarting the server restores IDs 101 and 102.
- `/api/demo/reset` intentionally deletes any added trips. Do not expose this demo route in a production system.
- HTTP Inspector shows **selected, teaching-relevant headers** (not every network header); use DevTools for the complete exchange. Measured elapsed time is approximate browser-observed time.
- The example uses cities as toy data; it does not make travel-time or routing claims.
- This source code is original teaching material, not official UNB courseware.

## Offline interview backup

1. Run the app once at home; check all scenarios, then leave the app running during the talk.
2. Keep a screenshot of the page ready; `TRIPLAB_PREVIEW.png` is included for visual backup.
3. If the local server crashes, use the static HTTP examples in your CS3103 lecture slides to continue the lesson.

