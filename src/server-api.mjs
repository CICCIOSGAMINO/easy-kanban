export const addContactToServer = async (contact) => {
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

export const addContactToKanbanOnServer = async (contactId) => {
    try {
        const response = await fetch('http://localhost:3000/api/clients', {
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

export const deleteContactsOnServer = async (contacts) => {
    try {
        const response = await fetch('http://localhost:3000/api/clients', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contacts),
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