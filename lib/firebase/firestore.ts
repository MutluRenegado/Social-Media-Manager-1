"use strict";
// firebase/firestore.ts
import { getFirestore, doc, setDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import app from './firebase-config';

const db = getFirestore(app);

// Save data to Firestore (sets a specific document)
export const saveDataToFirestore = async (collectionName, documentId, data) => {
    try {
        await setDoc(doc(db, collectionName, documentId), data);
        console.log(`Data saved successfully to collection ${collectionName} with document ID ${documentId}`);
    } catch (error) {
        console.error('Error saving data:', error instanceof Error ? error.message : error);
        throw error;
    }
};

// Update existing document in Firestore
export const updateDataInFirestore = async (collectionName, documentId, data) => {
    try {
        const docRef = doc(db, collectionName, documentId);
        await updateDoc(docRef, data);
        console.log(`Data updated successfully in collection ${collectionName} with document ID ${documentId}`);
    } catch (error) {
        console.error('Error updating data:', error instanceof Error ? error.message : error);
        throw error;
    }
};

// Add new document to Firestore (auto-generated ID)
export const addDataToFirestore = async (collectionName, data) => {
    try {
        const collectionRef = collection(db, collectionName);
        const docRef = await addDoc(collectionRef, data);
        console.log(`Data added successfully with ID: ${docRef.id}`);
    } catch (error) {
        console.error('Error adding data:', error instanceof Error ? error.message : error);
        throw error;
    }
};

// ✅ Export the db instance so it can be imported elsewhere
export { db };
