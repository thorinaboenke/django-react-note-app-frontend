import React, { useEffect, useState } from 'react';
import './MessageBoard.css';
import axios from "axios";


const MessageBoard = () => {
    const [notes, setNotes] = useState([]);
    const [isFilterActive, setIsFilterActive] = useState(false);
    const [text, setText] = useState();

    const handleChange = () => {
        setIsFilterActive(!isFilterActive);
    };

    const addNote = (text) => {
        const now = new Date()
        const postedNote = {
            id: now.toISOString(),
            text,
            published: now.toISOString(),
        };
        let newNoteList = [...notes, postedNote];
        setNotes(newNoteList);
    }

    const handleSubmit = async (e) => {
        const postedNote = { text }
        try {
            await axios.post("http://localhost:8000/api/notes/", postedNote);
        } catch (error) {
            console.log(e);
        }
        e.preventDefault();
        if (text) {
            addNote(text);
            setText("");
        }
    }

    useEffect(() => {
        async function fetchNotes() {
            try {
                const res = await fetch('http://localhost:8000/api/notes/');
                const notesList = await res.json();
                setNotes(notesList);
            } catch (e) {
                console.log(e);
            }
        }
        fetchNotes();
    }, []);

    return (
        <>
            <form onSubmit={e => { handleSubmit(e) }}>
                <div className="post">
                    <label>
                        My Note:
                        <textarea className="textInput"
                            type="textarea"
                            rows={6}
                            cols={40}
                            minLength={1}
                            maxLength={140}
                            value={text}
                            onChange={e => setText(e.target.value)}
                        />
                    </label>
                    <input className="submitButton" type="submit" value="Post my Note" disabled={!text} />
                </div>
            </form>

            <div className="filter" >
                <label>
                    <input type="checkbox"
                        checked={isFilterActive}
                        onChange={handleChange} />
                    I don't like coffee <span role="img" aria-label="cup">☕</span>
                </label>
            </div>
            <ul className="board">
                {notes.filter(
                    note => isFilterActive ? !note.text.includes("coffee") : note
                ).map(note => (
                    <li key={note.id}>
                        <div className="note">
                            <p>{note.text}</p>
                            <div className="date">{new Date(note.published).toLocaleString()}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </>

    )
}

export default MessageBoard;