export const noteService = async (userNotes: string) => {
    const connection = await fetch('http://localhost:3001/organize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ notes: userNotes })
    })

    return connection
}