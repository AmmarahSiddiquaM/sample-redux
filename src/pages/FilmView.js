import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { DebounceInput } from "react-debounce-input";
import axios from "axios";

const FilmView = () => {
  const [film, setFilm] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newReleaseYear, setNewReleaseYear] = useState("");
  const [newRentalDuration, setNewRentalDuration] = useState("");
  const [newRentalRate, setNewRentalRate] = useState("");
  const [newFilmLength, setNewFilmLength] = useState("");
  const [newReplacementCost, setNewReplacementCost] = useState("");
  const [newFilmRating, setNewFilmRating] = useState("");
  const [newSpecialFeatures, setNewSpecialFeatures] = useState("");

  const [reload, setReload] = useState(false);
  const [languages, setLanguages] = useState([]);

  const { filmId } = useParams();
  const languageRef = useRef(null);

  useEffect(() => {
    fetchFilm();
  }, [reload]);

  const fetchFilm = async () => {
    try {
      const response = await axios.get(`/film/${filmId}`);
      setFilm(response.data);
      //setNewTitle(response.data.film);
    } catch (error) {
      console.error("Error fetching film:", error);
    }
  };

  const handleFilmUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log("language id : ", languageRef.current.value);
      await axios.put(`/film/${filmId}`, {
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
      setEditMode(false);
      setReload(!reload);
    } catch (error) {
      console.error("Error updating film:", error);
    }
  };

  const fetchLanguages = async () => {
    try {
      const response = await axios.get(
        `/language/search?query=${film.language.name}`
      );
      setLanguages(response.data);
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  const handleLanguageSearch = async (inputValue) => {
    try {
      const response = await axios.get(
        `/language/search?query=${inputValue.target.value}`
      );
      console.log("languages:", response.data);
      setLanguages(response.data);
    } catch (error) {
      console.error("Error searching languages:", error);
      return [];
    }
  };

  const handleEditButtonClick = () => {
    setEditMode(true);
    fetchLanguages();
  };

  return (
    <div>
      {film ? (
        <div>
          {editMode ? (
            <form onSubmit={handleFilmUpdate}>
              <DebounceInput
                type="text"
                placeholder="Search..."
                minLength={2} // Minimum number of characters before debounce triggers
                debounceTimeout={300} // Debounce timeout in milliseconds
                onChange={handleLanguageSearch} // Handle input change event
              />
              <select ref={languageRef}>
                {languages.map((language) => (
                  <option
                    key={language.language_id}
                    value={language.language_id}
                  >
                    {language.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={film.title}
              />

              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder={film.description}
              />

              <input
                type="text"
                value={newReleaseYear}
                onChange={(e) => setNewReleaseYear(e.target.value)}
                placeholder={film.release_year}
              />
              <input
                type="text"
                value={newRentalDuration}
                onChange={(e) => setNewRentalDuration(e.target.value)}
                placeholder={film.rental_duration}
              />
              <input
                type="text"
                value={newRentalRate}
                onChange={(e) => setNewRentalRate(e.target.value)}
                placeholder={film.rental_rate}
              />
              <input
                type="text"
                value={newFilmLength}
                onChange={(e) => setNewFilmLength(e.target.value)}
                placeholder={film.length}
              />
              <input
                type="text"
                value={newReplacementCost}
                onChange={(e) => setNewReplacementCost(e.target.value)}
                placeholder={film.replacement_cost}
              />
              <input
                type="text"
                value={newFilmRating}
                onChange={(e) => setNewFilmRating(e.target.value)}
                placeholder={film.rating}
              />
              <input
                type="text"
                value={newSpecialFeatures}
                onChange={(e) => setNewSpecialFeatures(e.target.value)}
                placeholder={film.special_features}
              />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <>
              <h2>{`${film.title}`}</h2>
              <h2>{`${film.description}`}</h2>
              <h2>{`${film.release_year}, ${film.language.name}`}</h2>
              <h2>{`${film.rental_duration}`}</h2>
              <h2>{`${film.rental_rate}`}</h2>
              <h2>{`${film.length}`}</h2>
              <h2>{`${film.replacement_cost}`}</h2>
              <h2>{`${film.rating}`}</h2>
              <h2>{`${film.special_features}`}</h2>

              <button onClick={handleEditButtonClick}>Edit</button>
            </>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FilmView;
