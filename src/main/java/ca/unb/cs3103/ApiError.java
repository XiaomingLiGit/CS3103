package ca.unb.cs3103;

// Structured error JSON lets students inspect both 2xx and 4xx responses.
public record ApiError(String code, String message) { }
