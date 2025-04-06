import axios from "axios";

export const fetchNEOData = async () => {
  try {
    // Load the local file directly from the public folder
    const response = await fetch("/localData.json");

    if (!response.ok) {
      throw new Error("Error loading the local file");
    }

    const data = await response.json();
    console.log("data", data);
    return data.near_earth_objects;

  } catch (error) {
    console.error("Error fetching NEO data:", error);
    return [];
  }
};
