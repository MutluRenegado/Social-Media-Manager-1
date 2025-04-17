import { getFirestore, doc, setDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import app from './firebase-config';

const db = getFirestore(app);

// Save data to Firestore (sets a specific document)
export const saveDataToFirestore = async (collectionName: string, documentId: string, data: any) => {
  try {
    await setDoc(doc(db, collectionName, documentId), data);
    console.log('Data saved successfully');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error saving data:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
};

// Update existing document in Firestore
export const updateDataInFirestore = async (collectionName: string, documentId: string, data: any) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, data);
    console.log('Data updated successfully');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error updating data:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
};

// Add new document to Firestore (auto-generated ID)
export const addDataToFirestore = async (collectionName: string, data: any) => {
  try {
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, data);
    console.log('Data added successfully with ID:', docRef.id);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error adding data:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
};
