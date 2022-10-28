import { useEffect, useState } from "react"
import { projectAuth } from "../firebase/config"
import { useAuthContext } from "./useAuthContext"

export const useLogin = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    // for errors
    const [error,setError] = useState(null)
    // for loading state
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()

    const login = async ( email, password) => {
        setError(null)
        setIsPending(true)

        try {
            // login the user with the firebase auth method createuserwithemailandpassword
            const res = await projectAuth.signInWithEmailAndPassword(email,password)

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

    return { error, isPending, login}
}