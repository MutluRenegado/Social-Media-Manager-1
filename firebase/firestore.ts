import { getFirestore, doc, setDoc } from 'firebase/firestore';
import app from './firebase-config';

const db = getFirestore(app);

// Save data to Firestore
export const saveDataToFirestore = async (collection: string, documentId: string, data: any) => {
  try {
    await setDoc(doc(db, collection, documentId), data);
    console.log('Data saved successfully');
  } catch (error) {
    console.error('Error saving data:', error.message);
  }
};
