import { useState, useEffect /*, useRef*/ } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";

const AdvisorView = () => {
  const [advisor, setAdvisor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [isChairman, setIsChairman] = useState("");

  const [reload, setReload] = useState(false);

  const { advisorId } = useParams();
  //const chairmanRef = useRef(null);

  useEffect(() => {
    fetchAdvisor();
  }, [reload]);

  const fetchAdvisor = async () => {
    try {
      const response = await axios.get(`/advisor/${advisorId}`);
      setAdvisor(response.data);
      setNewName(response.data.first_name);
      setNewLastName(response.data.last_name);
      setIsChairman(response.data.is_chairmain);
      //chairmanRef.current.value = response.data.is_chairman;
    } catch (error) {
      console.error("Error fetching advisor:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/advisor/${advisorId}`, {
        first_name: newName,
        last_name: newLastName,
        is_chairmain: isChairman,
      });
      setEditMode(false);
      setReload(!reload);
    } catch (error) {
      console.error("Error updating advisor:", error);
    }
  };

  return (
    <div>
      {advisor ? (
        <div>
          {editMode ? (
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                placeholder={advisor.first_name}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <input
                type="text"
                placeholder={advisor.last_name}
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
              />

              <input
                type="checkbox"
                defaultChecked={isChairman}
                //ref={chairmanRef}
                onChange={(e) => setIsChairman(e.target.checked)}
              />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <>
              <h2>{`${advisor.first_name}${advisor.last_name}`}</h2>
              <h3>Chairman: {advisor.is_chairmain ? `True` : `False`}</h3>
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

export default AdvisorView;
