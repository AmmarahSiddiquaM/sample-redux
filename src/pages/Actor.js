import { useState, useEffect /*, useRef*/ } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const Actor = () => {
  const [actors, setActors] = useState([]);
  const [newActorFirstName, setNewActorFirstName] = useState("");
  const [newActorLastName, setNewActorLastName] = useState("");

  //const [selectedActorId, setSelectedActorId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchActors();
  }, [currentPage]); // Refetch actors when currentPage changes

  const navigate = useNavigate();
  //const newActorFirstNameRef = useRef(null);

  const fetchActors = async () => {
    try {
      const response = await axios.get(`/actor?page=${currentPage}`);
      setActors(response.data.actors);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching actors:", error);
    }
  };

  const handleCreateActor = async () => {
    try {
      await axios.post("/actor", {
        first_name: newActorFirstName,
        last_name: newActorLastName,
      });
      setNewActorFirstName("");
      setNewActorLastName("");

      setShowCreateForm(false);
      setCurrentPage(1); // Reset to first page after creating a new actor
    } catch (error) {
      console.error("Error creating actor:", error);
    }
  };

  const handleDeleteActor = async (actorId) => {
    try {
      await axios.delete(`/actor/${actorId}`);
      //fetchActors(); // Refresh actor list
      setCurrentPage(1); // Reset to first page after deleting a  actor
    } catch (error) {
      console.error("Error deleting actor:", error);
    }
  };

  // const handleUpdateActor = async () => {
  //   try {
  //     await axios.put(`/actor/${selectedActorId}`, {
  //       actor: newActorFirstNameRef.current.value,
  //     });
  //     setSelectedActorId(null);
  //     fetchActors(); // Refresh actor list
  //   } catch (error) {
  //     console.error("Error updating actor:", error);
  //   }
  // };

  const handleNavigateActor = (id) => {
    navigate(`./${id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {!showCreateForm ? (
        <>
          <h1>Actor Page</h1>
          <h2>Actors</h2>

          <ul>
            {actors.map((actor) => (
              <li key={actor.actor_id}>
                {/* {selectedActorId === actor.actor_id ? (
                  <>
                    <input
                      type="text"
                      ref={newActorFirstNameRef}
                      placeholder={actor.actor}
                    />
                    <button
                      onClick={() => {
                        handleUpdateActor();
                      }}
                    >
                      Done
                    </button>
                  </>
                ) : ( */}
                <>
                  {`${actor.first_name}, ${actor.last_name}`}{" "}
                  <button onClick={() => handleNavigateActor(actor.actor_id)}>
                    View
                  </button>
                  <button onClick={() => handleDeleteActor(actor.actor_id)}>
                    Delete
                  </button>
                  {/* <button onClick={() => setSelectedActorId(actor.actor_id)}>
                      Edit
                    </button> */}
                </>
                {/* )} */}
              </li>
            ))}
          </ul>

          {/* Pagination */}
          {/* <div>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => handlePageChange(i + 1)}>
                {i + 1}
              </button>
            ))}
          </div> */}

          <div>
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => {
              const page = i + 1;
              // Display only a subset of page numbers around the current page
              if (
                page === 1 ||
                page === currentPage ||
                page === totalPages ||
                Math.abs(currentPage - page) <= 2
              ) {
                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(page)}
                    disabled={currentPage === page}
                  >
                    {page}
                  </button>
                );
              }
              return null;
            })}
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>

          <button onClick={() => setShowCreateForm(true)}>
            Create New Actor
          </button>
        </>
      ) : (
        <>
          <h2>Create Actor</h2>
          <input
            type="text"
            value={newActorFirstName}
            onChange={(e) => setNewActorFirstName(e.target.value)}
            placeholder="Enter actor first name"
          />
          <input
            type="text"
            value={newActorLastName}
            onChange={(e) => setNewActorLastName(e.target.value)}
            placeholder="Enter actor second name"
          />
          <button onClick={handleCreateActor}>Create</button>
          <button onClick={() => setShowCreateForm(false)}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default Actor;
