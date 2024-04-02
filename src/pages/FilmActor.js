import { useState, useEffect, useRef } from "react";
import { DebounceInput } from "react-debounce-input";
import axios from "axios";
import toast from "react-hot-toast";

const FilmActor = () => {
  const [filmActors, setFilmActors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showFilmList, setShowFilmList] = useState(false);

  const [films, setFilms] = useState([]);
  const [actors, setActors] = useState([]);

  useEffect(() => {
    fetchFilms();
    //fetchFilmActors();
  }, [currentPage]); // Refetch filmActors when currentPage changes

  const filmRef = useRef(null);
  const actorRef = useRef(null);

  const fetchFilms = async () => {
    try {
      const response = await axios.get(`/film`);
      setFilms(response.data.films);
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  };

  const fetchFilmActors = async () => {
    try {
      const response = await axios.get(`/film-actor/${filmRef.current.value}`);
      setFilmActors(response.data.actors);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching filmActors:", error);
    }
  };

  const handleCreateFilmActor = async () => {
    console.log(filmRef.current.value, actorRef.current.value);
    try {
      await axios.post("/film-actor", {
        film_id: filmRef.current.value,
        actor_id: actorRef.current.value,
      });
      setShowCreateForm(false);
      setCurrentPage(1); // Reset to first page after creating a new filmActor
    } catch (error) {
      console.error("Error creating filmActor:", error);
      toast.error(error.response.data.error);
    }
  };

  const handleDeleteFilmActor = async (filmActorId) => {
    try {
      await axios.delete(`/film-actor/${filmRef.current.value}/${filmActorId}`);
      //fetchFilmActors(); // Refresh filmActor list
      setCurrentPage(1); // Reset to first page after deleting a  filmActor
    } catch (error) {
      console.error("Error deleting filmActor:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFetchFilms = async () => {
    try {
      const response = await axios.get("/film");
      setFilms(response.data.films);
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  };

  const handleFetchActors = async () => {
    try {
      const response = await axios.get("/actor");
      setActors(response.data.actors);
    } catch (error) {
      console.error("Error fetching store:", error);
    }
  };

  const handleFilmSearch = async (inputValue) => {
    try {
      const response = await axios.get(
        `/film/search?query=${inputValue.target.value}`
      );
      console.log("films:", response.data);
      setFilms(response.data);
    } catch (error) {
      console.error("Error searching films:", error);
      return [];
    }
  };

  const handleActorSearch = async (inputValue) => {
    try {
      const response = await axios.get(
        `/actor/search?query=${inputValue.target.value}`
      );
      console.log("actors:", response.data);
      setActors(response.data);
    } catch (error) {
      console.error("Error searching actors:", error);
      return [];
    }
  };

  const handleShowCreateForm = () => {
    handleFetchFilms(); // Fetch films when creating a new filmActor
    handleFetchActors(); // Fetch stores when creating a new filmActor
    setShowCreateForm(true);
  };

  const handleFetchFilmActors = () => {
    setShowFilmList(true);
    fetchFilmActors();
  };

  return (
    <div>
      <h1>FilmActor Page</h1>

      <DebounceInput
        type="text"
        placeholder="Search..."
        minLength={2} // Minimum number of characters before debounce triggers
        debounceTimeout={300} // Debounce timeout in milliseconds
        onChange={handleFilmSearch} // Handle input change event
      />

      <select ref={filmRef}>
        {films.map((film) => (
          <option key={film.film_id} value={film.film_id}>
            {film.title}
          </option>
        ))}
      </select>

      <button onClick={() => handleFetchFilmActors()}>Fetch Actors</button>

      {!showCreateForm ? (
        <>
          {showFilmList && (
            <>
              <h2>FilmActors</h2>{" "}
              <ul>
                {filmActors.map((filmActor) => (
                  <li key={filmActor.actor_id}>
                    <>
                      {`${filmActor.first_name}, ${filmActor.last_name}`}

                      <button
                        onClick={() =>
                          handleDeleteFilmActor(filmActor.actor_id)
                        }
                      >
                        Delete
                      </button>
                    </>
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
            </>
          )}

          {/* <button onClick={() => setShowCreateForm(true)}>
            Create New FilmActor
          </button> */}
          <button onClick={handleShowCreateForm}>Create New FilmActor</button>
        </>
      ) : (
        <>
          <h2>Create FilmActor</h2>

          {/* <DebounceInput
            type="text"
            placeholder="Search..."
            minLength={2} // Minimum number of characters before debounce triggers
            debounceTimeout={300} // Debounce timeout in milliseconds
            onChange={handleFilmSearch} // Handle input change event
          />

          <select ref={filmRef}>
            {films.map((film) => (
              <option key={film.film_id} value={film.film_id}>
                {film.title}
              </option>
            ))}
          </select> */}

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
                {`${actor.first_name}, ${actor.last_name}`}
              </option>
            ))}
          </select>

          {/* <input
            type="text"
            value={newFilmActorName}
            onChange={(e) => setNewFilmActorName(e.target.value)}
            placeholder="Enter filmActor name"
          /> */}
          <button onClick={handleCreateFilmActor}>Create</button>
          <button onClick={() => setShowCreateForm(false)}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default FilmActor;
