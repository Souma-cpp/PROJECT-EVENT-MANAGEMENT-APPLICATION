/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";

const CreateEvent = () => {

    const [name, setName] = useState("");
    const [venues, setVenues] = useState([]);
    const [user, setUser] = useState([]);
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [duration, setDuration] = useState("")

    const fetchInformation = async () => {
        try {
            const token = localStorage.getItem("accessToken");

            const response = await axios.get("http://localhost:3000/api/organizers/create", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            console.log("Full response:", response.data);
            console.log("Venues:", response.data.data.venues);
            console.log("User:", response.data.data.user);

            setVenues(response.data.data.venues);
            setUser(response.data.data.user);

        } catch (error) {
            console.error("Error fetching organizer info:", error.response?.data || error.message);
        }
    };



    useEffect(() => {
        console.log("calling the fetch information");
        fetchInformation();
    }, []);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    return (
        <div>
            <h2>This is the form for organizer to create an event</h2>
            {/* <label htmlFor="event_name">
                <input
                    name="name"
                    id="event_name"
                    value={name}
                    onChange={(e) => setName(name)}
                    placeholder="Enter the name of the event"
                />
            </label> */}
            <p>The venues are : {venues}</p>
            <p>The user is : {user}</p>
        </div>
    )
}

export default CreateEvent