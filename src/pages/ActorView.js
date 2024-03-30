import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";

const ActorView = () => {
  const [actor, setActor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [reload, setReload] = useState(false);

  const { actorId } = useParams();

  useEffect(() => {
    fetchActor();
  }, [reload]);

  const fetchActor = async () => {
    try {
      const response = await axios.get(`/actor/${actorId}`);
      setActor(response.data);
      setNewName(response.data.first_name);
      setNewLastName(response.data.last_name);
    } catch (error) {
      console.error("Error fetching actor:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/actor/${actorId}`, {
        first_name: newName,
        last_name: newLastName,
      });
      setEditMode(false);
      setReload(!reload);
    } catch (error) {
      console.error("Error updating actor:", error);
    }
  };

  return (
    <div>
      {actor ? (
        <div>
          {editMode ? (
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                placeholder={actor.first_name}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <input
                type="text"
                placeholder={actor.last_name}
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
              />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <>
              <h2>{`${actor.first_name}${actor.last_name}`}</h2>
              <button onClick={() => setEditMode(true)}>Edit</button>
            </>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ActorView;
