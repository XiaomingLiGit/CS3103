package ca.unb.cs3103;

import java.net.URI;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trips")
public class TripController {
    private final TripService service;

    public TripController(TripService service) {
        this.service = service;
    }

    // GET /api/trips -> 200 OK, JSON array
    @GetMapping
    public List<Trip> list() {
        return service.findAll();
    }

    // GET /api/trips/101 -> 200 OK; unknown ID -> 404 Not Found
    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable long id) {
        Trip trip = service.findById(id);
        if (trip == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError("TRIP_NOT_FOUND", "No trip with ID " + id));
        }
        return ResponseEntity.ok(trip);
    }

    // POST /api/trips -> 201 Created; invalid input -> 400 Bad Request
    @PostMapping
    public ResponseEntity<?> create(@RequestBody NewTrip request) {
        if (request == null || isBlank(request.origin()) || isBlank(request.destination())) {
            return ResponseEntity.badRequest().body(
                    new ApiError("VALIDATION_ERROR", "Origin and destination are required."));
        }
        Trip created = service.create(request.origin(), request.destination());
        return ResponseEntity.created(URI.create("/api/trips/" + created.id())).body(created);
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
