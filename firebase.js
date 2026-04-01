// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, writeBatch } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBg3q3Xuh5c2_03snkKThBtR3sc80k-OW4",
    authDomain: "quiz-app-b0339.firebaseapp.com",
    projectId: "quiz-app-b0339",
    storageBucket: "quiz-app-b0339.firebasestorage.app",
    messagingSenderId: "798217786332",
    appId: "1:798217786332:web:742058458be31599123519",
    measurementId: "G-2401Q7Y9XD"
};

let db;

export function initFirebase() {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("✅ Firebase initialized");
}

export async function saveResultToFirebase(studentName, score, total, percentage, answersDetail) {
    try {
        const resultData = {
            studentName, score, total, percentage, answers: answersDetail,
            timestamp: new Date().toISOString()
        };
        const docRef = await addDoc(collection(db, "quiz_results"), resultData);
        console.log("✅ Result saved:", docRef.id);
        return true;
    } catch (error) {
        console.error("❌ Error saving result:", error);
        return false;
    }
}

export async function loadResultsFromFirebase() {
    try {
        const q = query(collection(db, "quiz_results"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        const results = [];
        snapshot.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
        return results;
    } catch (error) {
        console.error("❌ Error loading results:", error);
        return [];
    }
}

export async function deleteAllResultsFromFirebase() {
    try {
        const snapshot = await getDocs(collection(db, "quiz_results"));
        const batch = writeBatch(db);
        snapshot.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        console.log("✅ All results deleted");
        return true;
    } catch (error) {
        console.error("❌ Error deleting results:", error);
        return false;
    }
}
