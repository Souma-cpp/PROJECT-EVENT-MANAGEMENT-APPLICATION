/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useState, useEffect } from "react";

export default function App() {
  const [events, setEvents] = useState([]);
  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users/allEvents");
      const fetchedEvents = response.data.data || [];
      setEvents(fetchedEvents);
    } catch (error) {
      console.log(error);
      setEvents([]);
    }
  }
  useEffect(() => {
    fetchEvents();
  }, []);
  return (
    <div>
      <p>Hello world</p>
      <p>
        {events.length === 0
          ? "No events to check out so far"
          : "The events are these"}
      </p>
    </div>
  );
}
