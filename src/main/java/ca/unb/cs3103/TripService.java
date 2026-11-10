package ca.unb.cs3103;

import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

@Service
public class TripService {
    // Intentional simplification for a teaching demo: no external database.
    // Data are lost when the application stops.
    private final ConcurrentMap<Long, Trip> trips = new ConcurrentHashMap<>();
    private final AtomicLong nextId = new AtomicLong(102);

    public TripService() {
        reset();
    }

    public List<Trip> findAll() {
        return trips.values().stream()
                .sorted(Comparator.comparingLong(Trip::id))
                .toList();
    }

    public Trip findById(long id) {
        return trips.get(id);
    }

    public Trip create(String origin, String destination) {
        long id = nextId.incrementAndGet();
        Trip trip = new Trip(id, origin.trim(), destination.trim());
        trips.put(id, trip);
        return trip;
    }

    // Only for reproducible classroom demos; not an endpoint for production apps.
    public synchronized List<Trip> reset() {
        trips.clear();
        trips.put(101L, new Trip(101L, "Montreal", "Quebec City"));
        trips.put(102L, new Trip(102L, "Fredericton", "Saint John"));
        nextId.set(102);
        return findAll();
    }
}
