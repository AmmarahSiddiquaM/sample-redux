import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DebounceInput } from "react-debounce-input";
import axios from "axios";

const ActorAward = () => {
  const [actorsWithAwards, setActorsWithAwards] = useState([]);
  //const [actorsWithOutAwards, setActorsWithOutAwards] = useState([]);

  const [newActorAwardFirstName, setNewActorAwardFirstName] = useState("");
  const [newActorAwardLastName, setNewActorAwardLastName] = useState("");
  const [newActorAwards, setNewActorAwards] = useState("");

  const [selectedActorId, setSelectedActorId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actors, setActors] = useState([]);

  useEffect(() => {
    fetchActorAwards();
  }, [currentPage]); // Refetch actorsWithAwards when currentPage changes

  const navigate = useNavigate();
  const newAwardsRef = useRef(null);
  const actorRef = useRef(null);

  const fetchActorAwards = async () => {
    try {
      const response = await axios.get(`/actor/withAwards?page=${currentPage}`);
      setActorsWithAwards(response.data.actors);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching actorsWithAwards:", error);
    }
  };

  const handleCreateActorAward = async () => {
    try {
      await axios.post("/actor-award", {
        first_name: newActorAwardFirstName,
        last_name: newActorAwardLastName,
        awards: newActorAwards,
        actor_id: actorRef.current.value,
      });
      setNewActorAwardFirstName("");
      setShowCreateForm(false);
      setCurrentPage(1); // Reset to first page after creating a new actorsWithAwards
    } catch (error) {
      console.error("Error creating actorsWithAwards:", error);
    }
  };

  const handleDeleteActorAward = async (actorsWithAwardsId) => {
    try {
      await axios.delete(`/actor-award/${actorsWithAwardsId}`);
      //fetchActorAwards(); // Refresh actorsWithAwards list
      setCurrentPage(1); // Reset to first page after deleting a  actorsWithAwards
    } catch (error) {
      console.error("Error deleting actorsWithAwards:", error);
    }
  };

  const handleUpdateActorAward = async () => {
    try {
      await axios.put(`/actor-award/${selectedActorId}`, {
        awards: newAwardsRef.current.value,
      });
      setSelectedActorId(null);
      fetchActorAwards(); // Refresh actorsWithAwards list
    } catch (error) {
      console.error("Error updating actorsWithAwards:", error);
    }
  };

  // const handleNavigateActorAward = (id) => {
  //   navigate(`./${id}`);
  // };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFetchActors = async () => {
    try {
      const response = await axios.get("/actor/search");
      setActors(response.data);
    } catch (error) {
      console.error("Error fetching actors:", error);
    }
  };

  const handleActorSearch = async (inputValue) => {
    try {
      const inputParts = inputValue.target.value.split(" "); // Split the input value into parts
      const firstName = inputParts[0]; // First part is assumed to be the first name
      const lastName =
        inputParts.length > 1 ? inputParts.slice(1).join(" ") : null; // Extract last name if available

      let queryString = `/actor/search?first_name=${firstName}`;
      if (lastName !== null) {
        queryString += `&last_name=${lastName}`; // Append last name to query string if provided
      }

      const response = await axios.get(queryString);
      console.log("actors:", response.data);
      setActors(response.data);
    } catch (error) {
      console.error("Error searching actors:", error);
      return [];
    }
  };

  const handleShowCreateForm = () => {
    handleFetchActors(); // Fetch actors when creating a new actorsWithAwards
    setShowCreateForm(true);
  };

  return (
    <div>
      {!showCreateForm ? (
        <>
          <h1>ActorAward Page</h1>
          <h2>ActorAwards</h2>

          <ul>
            {actorsWithAwards.map((actor) => (
              <li key={actor.actor_id}>
                {selectedActorId === actor.actor_id ? (
                  <>
                    <input
                      type="text"
                      ref={newAwardsRef}
                      placeholder={actorsWithAwards.actorsWithAwards}
                    />
                    <button
                      onClick={() => {
                        handleUpdateActorAward();
                      }}
                    >
                      Done
                    </button>
                  </>
                ) : (
                  <>
                    {`${actor.first_name}, ${actor.last_name}, Awards: ${actor.actor_award.awards} `}
                    {/* {actorsWithAwards.actorsWithAwards} {actorsWithAwards.actor.actor} */}
                    {/* <button
                      onClick={() =>
                        handleNavigateActorAward(
                          actorsWithAwards.actorsWithAwards_id
                        )
                      }
                    >
                      View
                    </button> */}
                    <button
                      onClick={() => handleDeleteActorAward(actor.actor_id)}
                    >
                      Delete
                    </button>
                    <button onClick={() => setSelectedActorId(actor.actor_id)}>
                      Edit
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>

          {/* Pagination */}
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

          {/* <button onClick={() => setShowCreateForm(true)}>
            Create New ActorAward
          </button> */}
          <button onClick={handleShowCreateForm}>Create New ActorAward</button>
        </>
      ) : (
        <>
          <h2>Create ActorAward</h2>

          <DebounceInput
            type="text"
            placeholder="Search..."
            minLength={2} // Minimum number of characters before debounce triggers
            debounceTimeout={300} // Debounce timeout in milliseconds
            onChange={handleActorSearch} // Handle input change event
          />

          <select ref={actorRef}>
            {actors.map((actor) => (
              <option key={actor.actor_id} value={actor.actor_id}>
                {`${actor.first_name} ${actor.last_name}`}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={newActorAwardFirstName}
            onChange={(e) => setNewActorAwardFirstName(e.target.value)}
            placeholder="Enter first name"
          />

          <input
            type="text"
            value={newActorAwardLastName}
            onChange={(e) => setNewActorAwardLastName(e.target.value)}
            placeholder="Enter last name"
          />

          <input
            type="text"
            value={newActorAwards}
            onChange={(e) => setNewActorAwards(e.target.value)}
            placeholder="Enter awards"
          />
          <button onClick={handleCreateActorAward}>Create</button>
          <button onClick={() => setShowCreateForm(false)}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default ActorAward;
