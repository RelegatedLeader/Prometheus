import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Notes({ userHash }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!userHash) {
        console.error('userHash is undefined. Cannot fetch notes.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/notes/${userHash}`);
        setNotes(response.data);
        console.log('Fetched notes:', response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, [userHash]);

  const handleSave = async () => {
    if (!title.trim() || !body.trim()) {
      alert('Both title and body are required.');
      return;
    }

    try {
      if (editMode) {
        console.log('Updating note:', { editId, title, body });
        await axios.put(`http://localhost:3001/notes/${editId}`, { title, body });
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === editId ? { ...note, title, body } : note
          )
        );
        setEditMode(false);
        setEditId(null);
      } else {
        console.log('Creating note:', { userHash, title, body });
        const response = await axios.post('http://localhost:3001/notes', {
          user_hash: userHash,
          title,
          body,
        });
        console.log('API response:', response);
        setNotes((prevNotes) => [...prevNotes, response.data]);
      }
      setTitle('');
      setBody('');
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save the note. Check the console for details.');
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setBody(note.body);
    setEditMode(true);
    setEditId(note.id);
    console.log('Editing note:', note);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await axios.delete(`http://localhost:3001/notes/${id}`);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      console.log('Deleted note with ID:', id);
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete the note. Check the console for details.');
    }
  };

  return (
    <div className="Notes">
      <h1>My Notes</h1>

      <section>
        <h2>{editMode ? 'Edit Note' : 'Create Note'}</h2>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
          />
        </div>
        <div>
          <label htmlFor="body">Body:</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Note Body"
          />
        </div>
        <button onClick={handleSave}>{editMode ? 'Update Note' : 'Save Note'}</button>
      </section>

      <section>
        <h2>Your Notes</h2>
        {notes.length > 0 ? (
          <ul>
            {notes.map((note) => (
              <li key={note.id}>
                <h3>{note.title}</h3>
                <p>{note.body}</p>
                <div>
                  <button onClick={() => handleEdit(note)}>Edit</button>
                  <button onClick={() => handleDelete(note.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No notes available. Start by creating one!</p>
        )}
      </section>
    </div>
  );
}

export default Notes;
