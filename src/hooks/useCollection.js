import { useEffect, useRef, useState } from "react"
import { projectFirestore } from "../firebase/config"

export const useCollection = (collection, _query, _orderBy) => {
    const [documents, setDocuments] = useState(null)
    const [error, setError] = useState(null)

    // _query is an array that is different on every function call
    const query = useRef(_query).current
    const order = useRef(_orderBy).current

    useEffect(() => {
        // using let instead of const for future changes
        let ref = projectFirestore.collection(collection)

        if (query) {
            ref = ref.where(...query)
        }

        if (order) {
            ref = ref.orderBy(...order)
        }

        const unsubscribe = ref.onSnapshot((snapshot) => {
            let results = []
            snapshot.docs.forEach(doc => {
                // .data to get data from the doc
                results.push({...doc.data(), id: doc.id})
            })

            // update state
            setDocuments(results)
            setError(null)
        }, (error) => {
            console.log(error)
            setError('could not fetch the data')
        })

        // unsub on unmount
        return () => unsubscribe()

        
    }, [collection, query, order])

    return { documents, error}
}