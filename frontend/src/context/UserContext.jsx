import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'

export const userDataContext = createContext()

function UserContext({ children }) {

    const serverUrl = "https://ai-assistant-backend-irf6.onrender.com"

    const [userData, setUserData] = useState(null)

    const [frontendImage, setFrontendImage] = useState(null)

    const [backendImage, setBackendImage] = useState(null)

    const [selectedImage, setSelectedImage] = useState(null)

    const handleCurrentUser = async () => {

        try {

            const token = localStorage.getItem("token")

            if (!token) return

            const result = await axios.get(
                `${serverUrl}/api/user/current`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setUserData(result.data)

            console.log(result.data)

        } catch (error) {

            console.log(error)
        }
    }

    const getGeminiResponse = async (command) => {

        try {

            const token = localStorage.getItem("token")

            const result = await axios.post(
                `${serverUrl}/api/user/asktoassistant`,
                { command },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            return result.data

        } catch (error) {

            console.log(error)
        }
    }

    useEffect(() => {

        handleCurrentUser()

    }, [])

    const value = {
        serverUrl,
        userData,
        setUserData,
        backendImage,
        setBackendImage,
        frontendImage,
        setFrontendImage,
        selectedImage,
        setSelectedImage,
        getGeminiResponse
    }

    return (
        <div>
            <userDataContext.Provider value={value}>
                {children}
            </userDataContext.Provider>
        </div>
    )
}

export default UserContext