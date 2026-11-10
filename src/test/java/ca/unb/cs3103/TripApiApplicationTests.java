package ca.unb.cs3103;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class TripApiApplicationTests {
    @Autowired private MockMvc mvc;
    @Autowired private TripService service;

    @BeforeEach
    void startWithSampleData() {
        service.reset();
    }

    @Test
    void listReturns200AndSampleTrips() throws Exception {
        mvc.perform(get("/api/trips"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(101))
                .andExpect(jsonPath("$[1].id").value(102));
    }

    @Test
    void getExistingTripReturns200() throws Exception {
        mvc.perform(get("/api/trips/101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.origin").value("Montreal"));
    }

    @Test
    void getMissingTripReturns404() throws Exception {
        mvc.perform(get("/api/trips/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("TRIP_NOT_FOUND"));
    }

    @Test
    void postValidTripReturns201LocationAndBody() throws Exception {
        mvc.perform(post("/api/trips")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"origin\":\"Moncton\",\"destination\":\"Fredericton\"}"))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/api/trips/103"))
                .andExpect(jsonPath("$.id").value(103))
                .andExpect(jsonPath("$.destination").value("Fredericton"));
    }

    @Test
    void postMissingOriginReturns400() throws Exception {
        mvc.perform(post("/api/trips")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"origin\":\"\",\"destination\":\"Fredericton\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
    }

    @Test
    void resetRestoresTwoTrips() throws Exception {
        service.create("Moncton", "Halifax");
        mvc.perform(post("/api/demo/reset"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void frontendIsServedAtRoot() throws Exception {
        mvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.TEXT_HTML));
    }
}
