import { useEffect, useReducer, useState } from "react"
import { projectFirestore, timestamp } from "../firebase/config"

let initialState = {
    // when firestore sends back a response this part of the state is matched to the document
    document: null,
    isPending: false,
    error: null,
    success: null
}

const firestoreReducer = (state, action) => {
    switch(action.type) {
        case 'IS_PENDING':
            return {isPending: true, document: null, success: false,error: null}
        case 'ADDED_DOCUMENT':
            return{...state,isPending: false, document: action.payload, success: true, error: null}
        case 'DELETED_DOCUMENT':
            return{...state,isPending: false, document: null, success: true, error: null}
        case 'ERROR':
            return{isPending: false, document: null, success: false, error: action.payload}  
        default:
            return state
    }
  
}

export const useFirestore = (collection) => {
    // response represents the response gotten back from firestore
    // dispatch is used in usereducer hook to dispatch new action to the reducer
    const [response, dispatch] = useReducer(firestoreReducer, initialState)
    const [isCancelled, setIsCancelled] = useState(false)

    // collection ref
    const ref = projectFirestore.collection(collection)

    // only dispatch if not cancelled
    const dispatchIfNotCancelled = (action) => {
        if (!isCancelled) {
            dispatch(action)
        }
    }

    // add documents
    const addDoc = async (doc) => {
        dispatch({type: 'IS_PENDING'})

        try {
          const createdAt = timestamp.fromDate(new Date())
          const addedDoc =  await ref.add({...doc, createdAt})
        //   only update when isCncelled is false before performing dispatch
          dispatchIfNotCancelled({type: 'ADDED_DOCUMENT',payload: addedDoc})
        } catch (err) {
            dispatchIfNotCancelled({type: 'ERROR', payload: err.message})
        }
    }

    // delete document
    const deleteDoc = async (id) => {
        dispatch({type: 'IS_PENDING'})

        try {
             await ref.doc(id).delete()
            dispatchIfNotCancelled({type: 'DELETED_DOCUMENT'})
        } catch(err) {
            dispatchIfNotCancelled({type: 'ERROR', payload: 'could not delete'})
        }
    }

    // for cleanup fxn
    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return {addDoc, deleteDoc, response}
} 