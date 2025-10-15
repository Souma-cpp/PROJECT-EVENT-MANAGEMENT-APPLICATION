import React, { useEffect } from 'react';
import { UserButton, UserProfile, useUser } from '@clerk/clerk-react';
import { useAuth } from '@clerk/clerk-react';
import { useState } from 'react';

const Dashboard = () => {
    const { getToken } = useAuth();
    const token = getToken();
    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    return (
        <div className='min-h-screen min-w-screen bg-black text-white'>
            <div>This is the dashboard page for the user</div>
            <div className='flex justify-center items-center text-2xl font-semibold'>
                <p>Hello , {user.firstName}</p>
                <p>your email address is : {user.emailAddresses[0].emailAddress}</p>
                <UserButton />
            </div>
        </div>
    )
}

export default Dashboard