import { useEffect, useState } from "react"
import { projectAuth } from "../firebase/config"
import { useAuthContext } from "./useAuthContext"

export const useSignup = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    // for errors
    const [error,setError] = useState(null)
    // for loading state
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()

// using async because of await
    const signup = async (username, email, password) => {
        setError(null)
        setIsPending(true)

        try {
            // signup the user with the firebase auth method createuserwithemailandpassword
            const res = await projectAuth.createUserWithEmailAndPassword(email,password)
            console.log(res.user)
 
            if (!res) {
                // if password is too short or email has been taken
                throw new Error('Could not complete signup')
            }

            // give user display name
            await res.user.updateProfile({ displayName: username})

            // dispatch login action
            dispatch({type: 'LOGIN', payload: res.user})

            if (!isCancelled) {
                setError(null)
                setIsPending(false)
            }
            
        } catch(err) {
            if (!isCancelled) {
                console.log(err.message)
                setError(err.message)
                setIsPending(false)
            }
        }
    }
    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { error, isPending, signup}
}