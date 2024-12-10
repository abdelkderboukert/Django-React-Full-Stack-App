import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css";
import axios from "axios";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Note deleted!");
        else alert("Failed to delete note.");
        getNotes();
      })
      .catch((error) => alert(error));
  };

  const createNote = (e) => {
    e.preventDefault();
    api
      .post("/api/notes/", { content, title })
      .then((res) => {
        if (res.status === 201) alert("Note created!");
        else alert("Failed to make note.");
        getNotes();
      })
      .catch((err) => alert(err));
  };
  const logout = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN); // Assuming you store the refresh token in local storage

    if (!refreshToken) {
      console.error("No refresh token found");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/token/blacklist/",
        {
          refresh: refreshToken,
        }
      );

      if (response.status === 200) {
        // Successfully logged out
        localStorage.removeItem(REFRESH_TOKEN);
        localStorage.removeItem(ACCESS_TOKEN); // Remove the refresh token from local storage
        // Optionally redirect the user or update the UI
        <Navigate to="/login" />
        console.log("Logged out successfully");
      }
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div>
      <div>
        <h2>Notes</h2>
        {notes.map((note) => (
          <Note note={note} onDelete={deleteNote} key={note.id} />
        ))}
      </div>
      <h2>Create a Note</h2>
      <form onSubmit={createNote}>
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <label htmlFor="content">Content:</label>
        <br />
        <textarea
          id="content"
          name="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <br />
        <input type="submit" value="Submit"></input>
      </form>

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Home;
