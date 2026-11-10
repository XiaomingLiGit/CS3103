package ca.unb.cs3103;

// This is the JSON shape we expect in a POST request body.
public record NewTrip(String origin, String destination) { }
