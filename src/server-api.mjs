export const addContactOnServer = async (contact) => {
    try {
        const response = await fetch('http://localhost:3000/api/new-client', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contact),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('Contact added to server:', data)
    } catch (error) {
        console.error('Error adding contact to server:', error)
    }
}

export const modifyContactOnServer = async (contact) => {
    try {
        const response = await fetch(`http://localhost:3000/api/modify-client/${contact.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contact),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('Contact modified on server:', data)
    } catch (error) {
        console.error('Error modifying contact on server:', error)
    }
}

export const deleteContactsOnServer = async (clientId) => {
    try {

        console.log('@CLIENT_ID to delete:', clientId)
        const response = await fetch(`http://localhost:3000/api/delete-client/${clientId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('Contacts deleted on server:', data)
    } catch (error) {
        console.error('Error deleting contacts on server:', error)
    }
}

export const addContactToKanbanOnServer = async (contactId) => {
    try {
        const response = await fetch('http://localhost:3000/api/new-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: contactId }),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('Contact added to server:', data)
    } catch (error) {
        console.error('Error adding contact to server:', error)
    }
}

export const deleteContactFromKanbanOnServer = async (clientId) => {
    try {
        console.log('@CLIENT_ID to delete from KANBAN:', clientId)
        const response = await fetch(`http://localhost:3000/api/delete-task/${clientId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('Contact deleted from KANBAN on server:', data)
    } catch (error) {
        console.error('Error deleting contact from KANBAN on server:', error)
    }
}

export const updateTaskPositionOnServer = async (taskId, newPosition) => {
    try {
        const response = await fetch(
            `http://localhost:3000/api/update-task-position/${taskId}/${newPosition}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('Task position updated on server:', data)
    } catch (error) {
        console.error('Error updating task position on server:', error)
    }
}

export const updateTaskDetailsOnServer = async (taskId, updatedDetails) => {
    try {
        const response = await fetch(
            `http://localhost:3000/api/update-task-details/${taskId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedDetails),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('Task details updated on server:', data)
    } catch (error) {
        console.error('Error updating task details on server:', error)
    }
}