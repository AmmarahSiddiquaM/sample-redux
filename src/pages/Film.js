import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DebounceInput } from "react-debounce-input";
import axios from "axios";

const Film = () => {
  const [films, setFilms] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newReleaseYear, setNewReleaseYear] = useState("");
  const [newRentalDuration, setNewRentalDuration] = useState("");
  const [newRentalRate, setNewRentalRate] = useState("");
  const [newFilmLength, setNewFilmLength] = useState("");
  const [newReplacementCost, setNewReplacementCost] = useState("");
  const [newFilmRating, setNewFilmRating] = useState("");
  const [newSpecialFeatures, setNewSpecialFeatures] = useState("");
  //const [selectedFilmId, setSelectedFilmId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    fetchFilmes();
  }, [currentPage]); // Refetch films when currentPage changes

  const navigate = useNavigate();
  //const newTitleRef = useRef(null);
  const languageRef = useRef(null);

  const fetchFilmes = async () => {
    try {
      const response = await axios.get(`/film?page=${currentPage}`);
      setFilms(response.data.films);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  };

  const handleCreateFilm = async () => {
    try {
      await axios.post("/film", {
        title: newTitle,
        language_id: languageRef.current.value,
        description: newDescription,
        release_year: newReleaseYear,
        rental_duration: newRentalDuration,
        retal_rate: newRentalRate,
        length: newFilmLength,
        replacement_cost: newReplacementCost,
        rating: newFilmRating,
        special_features: newSpecialFeatures,
      });
      setNewTitle("");
      setNewDescription("");
      setNewReleaseYear("");
      setNewRentalDuration("");
      setNewRentalRate("");
      setNewFilmLength("");
      setNewReplacementCost("");
      setNewFilmRating("");
      setNewSpecialFeatures("");

      setShowCreateForm(false);
      setCurrentPage(1); // Reset to first page after creating a new film
    } catch (error) {
      console.error("Error creating film:", error);
    }
  };

  const handleDeleteFilm = async (filmId) => {
    try {
      await axios.delete(`/film/${filmId}`);
      //fetchFilmes(); // Refresh film list
      setCurrentPage(1); // Reset to first page after deleting a  film
    } catch (error) {
      console.error("Error deleting film:", error);
    }
  };

  // const handleUpdateFilm = async () => {
  //   try {
  //     await axios.put(`/film/${selectedFilmId}`, {
  //       film: newTitleRef.current.value,
  //     });
  //     setSelectedFilmId(null);
  //     fetchFilmes(); // Refresh film list
  //   } catch (error) {
  //     console.error("Error updating film:", error);
  //   }
  // };

  const handleNavigateFilm = (id) => {
    navigate(`./${id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFetchLanguages = async () => {
    try {
      const response = await axios.get("/language");
      setLanguages(response.data.languages);
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  const handleLanguageSearch = async (inputValue) => {
    try {
      const response = await axios.get(
        `/language/search?query=${inputValue.target.value}`
      );
      //console.log("languages:", response.data);
      setLanguages(response.data);
    } catch (error) {
      console.error("Error searching languages:", error);
      return [];
    }
  };

  const handleShowCreateForm = () => {
    handleFetchLanguages(); // Fetch languages when creating a new film
    setShowCreateForm(true);
  };

  return (
    <div>
      {!showCreateForm ? (
        <>
          <h1>Film Page</h1>
          <h2>Filmes</h2>

          <ul>
            {films.map((film) => (
              <li key={film.film_id}>
                {/* {selectedFilmId === film.film_id ? (
                  <>
                    <input
                      type="text"
                      ref={newTitleRef}
                      placeholder={film.film}
                    />
                    <button
                      onClick={() => {
                        handleUpdateFilm();
                      }}
                    >
                      Done
                    </button>
                  </>
                ) : ( */}
                <>
                  {`${film.title}, ${film.release_year}`}
                  {/* {film.film} {film.language.language} */}
                  <button onClick={() => handleNavigateFilm(film.film_id)}>
                    View
                  </button>
                  <button onClick={() => handleDeleteFilm(film.film_id)}>
                    Delete
                  </button>
                  {/* <button
                      onClick={() => setSelectedFilmId(film.film_id)}
                    >
                      Edit
                    </button> */}
                </>
                {/* )} */}
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
            Create New Film
          </button> */}
          <button onClick={handleShowCreateForm}>Create New Film</button>
        </>
      ) : (
        <>
          <h2>Create Film</h2>

          <DebounceInput
            type="text"
            placeholder="Search..."
            minLength={2} // Minimum number of characters before debounce triggers
            debounceTimeout={300} // Debounce timeout in milliseconds
            onChange={handleLanguageSearch} // Handle input change event
          />

          <select ref={languageRef}>
            {languages.map((language) => (
              <option key={language.language_id} value={language.language_id}>
                {language.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter film title"
          />

          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Enter film description"
          />

          <input
            type="text"
            value={newReleaseYear}
            onChange={(e) => setNewReleaseYear(e.target.value)}
            placeholder="Enter film release year"
          />
          <input
            type="text"
            value={newRentalDuration}
            onChange={(e) => setNewRentalDuration(e.target.value)}
            placeholder="Enter film rental duration"
          />
          <input
            type="text"
            value={newRentalRate}
            onChange={(e) => setNewRentalRate(e.target.value)}
            placeholder="Enter film  rental rate"
          />
          <input
            type="text"
            value={newFilmLength}
            onChange={(e) => setNewFilmLength(e.target.value)}
            placeholder="Enter film length"
          />
          <input
            type="text"
            value={newReplacementCost}
            onChange={(e) => setNewReplacementCost(e.target.value)}
            placeholder="Enter film replacement cost"
          />
          <input
            type="text"
            value={newFilmRating}
            onChange={(e) => setNewFilmRating(e.target.value)}
            placeholder="Enter film rating"
          />
          <input
            type="text"
            value={newSpecialFeatures}
            onChange={(e) => setNewSpecialFeatures(e.target.value)}
            placeholder="Enter film special features"
          />
          <button onClick={handleCreateFilm}>Create</button>
          <button onClick={() => setShowCreateForm(false)}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default Film;
