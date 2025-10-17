/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import axios from 'axios';

const CreateVenue = () => {

    const [user, setUser] = useState({});
    const fetchData = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get("http://localhost:3000/api/owners/create", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            //console.log(response.data.data.name)
            //console.log(response.data.data.roles[0])
            //console.log(response.data.data.email)
            //console.log(response.data.data.isVerified)

            setUser({
                username: response.data.data.name,
                role: response.data.data.roles[0],
                email: response.data.data.email,
                verified: response.data.data.isVerified,
            })


        } catch (error) {
            console.log("Some error happened while creating the venue", error);
        }
    }

    useEffect(() => {
        fetchData()
    }, []);

    return (
        <div>
            <p>The user details are : {user.username}</p>
            <p>The user details are : {user.email}</p>
        </div>
    )
}

export default CreateVenue