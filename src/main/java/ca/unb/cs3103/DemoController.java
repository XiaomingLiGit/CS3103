package ca.unb.cs3103;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/demo")
public class DemoController {
    private final TripService service;

    public DemoController(TripService service) {
        this.service = service;
    }

    // Classroom-only helper: resets the in-memory sample data.
    @PostMapping("/reset")
    public List<Trip> reset() {
        return service.reset();
    }
}
