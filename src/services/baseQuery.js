import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:8000/api";

export const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    
    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json");
    
    return headers;
  },
  responseHandler: async (response) => {
    // Only parse JSON for successful responses
    if (response.status >= 200 && response.status < 300) {
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    }
    // For error responses, use default handling
    return response.text().then(text => {
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    });
  },
});
