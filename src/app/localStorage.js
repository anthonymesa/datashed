
// if (!('indexedDB' in window)) {
//     alert("This browser doesn't support IndexedDB.");
// }

// let db;

// const DBOpenRequest = window.indexedDB.open('Datastream', 3);

// DBOpenRequest.onupgradeneeded = (event) => {
//     const db = event.target.result;
//     db.createObjectStore('application', {
//         keyPath: 'uuid',
//     })
// }

// DBOpenRequest.onerror = (event) => {
//     console.error('failed to initialize indexedDb')
// };

// DBOpenRequest.onsuccess = (event) => {
//     console.log('initialized indexDb');
//     db = event.target.result;
// };

// export default {
//     datastream: {
//         add: (datum) => {
//             return new Promise((resolve, reject) => {
//                 const tx = db.transaction('application', 'readwrite');
//                 const store = tx.objectStore('application');
//                 const request = store.add(datum);

//                 request.onsuccess = () => {
//                     resolve(request.result);
//                 };

//                 request.onerror = () => {
//                     reject(request.error);
//                 };

//                 tx.oncomplete = () => {
//                     console.log("Transaction completed.");
//                 };

//                 tx.onerror = () => {
//                     reject(tx.error);
//                 };
//             });
//         },
//         edit: (datum) => {
//             return new Promise((resolve, reject) => {
//                 const tx = db.transaction('application', 'readwrite');
//                 const store = tx.objectStore('application');
//                 const request = store.put(datum);

//                 request.onsuccess = () => {
//                     resolve(request.result);
//                 };

//                 request.onerror = () => {
//                     reject(request.error);
//                 };

//                 tx.oncomplete = () => {
//                     console.log("Transaction completed.");
//                 };

//                 tx.onerror = () => {
//                     reject(tx.error);
//                 };
//             });
//         },
//         get: (uuid) => {
//             return new Promise((resolve, reject) => {
//                 const tx = db.transaction('application', 'readonly');
//                 const store = tx.objectStore('application');
//                 const request = store.get(uuid);

//                 request.onsuccess = () => {
//                     resolve(request.result);
//                 };

//                 request.onerror = () => {
//                     reject(request.error);
//                 };

//                 tx.oncomplete = () => {
//                     console.log("Transaction completed.");
//                 };

//                 tx.onerror = () => {
//                     reject(tx.error);
//                 };
//             });
//         },
//         getAll: () => {
//             return new Promise((resolve, reject) => {
//                 const tx = db.transaction('application', 'readonly');
//                 const store = tx.objectStore('application');
//                 const request = store.getAll();

//                 request.onsuccess = () => {
//                     resolve(request.result);
//                 };

//                 request.onerror = () => {
//                     reject(request.error);
//                 };

//                 tx.oncomplete = () => {
//                     console.log("Transaction completed.");
//                 };

//                 tx.onerror = () => {
//                     reject(tx.error);
//                 };
//             });
//         },
//         delete: (uuid) => {
//             return new Promise((resolve, reject) => {
//                 const tx = db.transaction('application', 'readwrite');
//                 const store = tx.objectStore('application');
//                 const request = store.delete(uuid);

//                 request.onsuccess = () => {
//                     resolve(request.result);
//                 };

//                 request.onerror = () => {
//                     reject(request.error);
//                 };

//                 tx.oncomplete = () => {
//                     console.log("Transaction completed.");
//                 };

//                 tx.onerror = () => {
//                     reject(tx.error);
//                 };
//             });
//         }
//     }
// }