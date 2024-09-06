const { collection, getDocs, query, where, addDoc, updateDoc, doc, increment } = require('firebase/firestore');
const { db } = require('../utils/utils');

const dataCollection = collection(db, "data");

async function getStats() {
    try {
        const result = await getDocs(dataCollection);

        let stats = {
            "create": 0,
            "read": 0,
            "update": 0,
            "delete": 0
        };

        result.forEach((docSnap) => {
            const data = docSnap.data();
            const operation = data.operation;
            const count = data.count;

            if (stats[operation] !== undefined) {
                stats[operation] += count;
            }
        });

        return stats;
    } catch (error) {
        console.error('Error getting stats:', error);
    }
}

async function increaseOperation(operation) {
    try {
        const q = query(dataCollection, where("operation", "==", operation));
        const result = await getDocs(q);

        if (result.empty) {
            await addDoc(dataCollection, {
                "operation": operation,
                "count": 1
            });
        } else {
            result.forEach(async (docSnap) => {
                const docRef = doc(db, 'data', docSnap.id);
                await updateDoc(docRef, {
                    "count": increment(1)
                });
            });
        }
    } catch (error) {
        console.error('Error increasing operation:', error);
    }
}

module.exports = {
    increaseOperation,
    getStats
};