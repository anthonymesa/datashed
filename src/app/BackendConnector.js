import { getUser } from "./SessionManager/SessionManagerSlice";

const BackendConnector = () => {

    const backendUrl = 'http://localhost:3000/'
    const userId = getUser()

    const getDatastreams = (cb) => {
        const url = `${backendUrl}/datastreams/${userId}`;

        fetch(url).then(response => {
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json()
        })
        .then(data => {
            cb(data ? data : [])
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    const createDatastream = (data, cb) => {
        const url = `${backendUrl}/datastreams`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            cb(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    };

    const getDatastream = (uuid, cb) => {
        const url = `${backendUrl}/datastream/${uuid}`;
        fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            cb(data ? data : {});
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    };
    
    const updateDatastream = (uuid, newData, cb) => {
        const url = `${backendUrl}/datastream/${uuid}`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            cb(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    };
    
    const deleteDatastream = (uuid, cb) => {
        const url = `${backendUrl}/datastream/${uuid}`;
        fetch(url, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            cb(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    };
    
    const getActions = (cb) => {
        const url = `${backendUrl}/actions/${userId}`;

        fetch(url).then(response => {
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json()
        })
        .then(data => {
            cb(data ? data : [])
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    const createAction = (data, cb) => {
        const url = `${backendUrl}/actions`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            cb(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    };

    const getAction = (uuid, cb) => {
        const url = `${backendUrl}/action/${uuid}`;
        fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            cb(data ? data : {});
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    };
    
    const updateAction = (uuid, newData, cb) => {
        const url = `${backendUrl}/action/${uuid}`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            cb(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    };
    
    const deleteAction = (uuid, cb) => {
        const url = `${backendUrl}/action/${uuid}`;
        fetch(url, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            cb(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    };

    const getSessionStatus = (cb) => {
        fetch(`${backendUrl}/session-status`)
        .then(response => response.json())
        .then(data => {
            if (data.session === 'active') {
                cb(true)
            } else {
                cb(false)
            }
        })
        .catch(error => console.error('Error:', error));
    }

    const logOut = (cb) => {
        fetch(`${backendUrl}/logout`)
        .then(response => response.json())
        .then(data => {
            cb()
        })
        .catch(error => console.error('Error:', error));
    }

    return {
        getDatastreams,
        createDatastream,
        getDatastream,
        updateDatastream,
        deleteDatastream,
        getActions,
        createAction,
        getAction,
        updateAction,
        deleteAction,
        getSessionStatus,
        logOut
    }
}

export default BackendConnector