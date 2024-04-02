import { useState, useEffect, useRef } from "react";
import { DebounceInput } from "react-debounce-input";
import axios from "axios";
import toast from "react-hot-toast";

const FilmCategory = () => {
  const [filmCategories, setFilmCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showFilmList, setShowFilmList] = useState(false);

  const [films, setFilms] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchFilms();
    //fetchFilmCategories();
  }, [currentPage]); // Refetch filmCategories when currentPage changes

  const filmRef = useRef(null);
  const categoryRef = useRef(null);

  const fetchFilms = async () => {
    try {
      const response = await axios.get(`/film`);
      setFilms(response.data.films);
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  };

  const fetchFilmCategories = async () => {
    try {
      const response = await axios.get(
        `/film-category/${filmRef.current.value}`
      );
      setFilmCategories(response.data.categories);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching filmCategories:", error);
    }
  };

  const handleCreateFilmCategory = async () => {
    console.log(filmRef.current.value, categoryRef.current.value);
    try {
      await axios.post("/film-category", {
        film_id: filmRef.current.value,
        category_id: categoryRef.current.value,
      });
      setShowCreateForm(false);
      setCurrentPage(1); // Reset to first page after creating a new filmCategory
    } catch (error) {
      console.error("Error creating filmCategory:", error);
      toast.error(error.response.data.error);
    }
  };

  const handleDeleteFilmCategory = async (filmCategoryId) => {
    try {
      await axios.delete(
        `/film-category/${filmRef.current.value}/${filmCategoryId}`
      );
      //fetchFilmCategories(); // Refresh filmCategory list
      setCurrentPage(1); // Reset to first page after deleting a  filmCategory
    } catch (error) {
      console.error("Error deleting filmCategory:", error);
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

  const handleFetchCategories = async () => {
    try {
      const response = await axios.get("/category");
      setCategories(response.data.categories);
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

  const handleCategorySearch = async (inputValue) => {
    try {
      const response = await axios.get(
        `/category/search?query=${inputValue.target.value}`
      );
      console.log("categories:", response.data);
      setCategories(response.data);
    } catch (error) {
      console.error("Error searching categories:", error);
      return [];
    }
  };

  const handleShowCreateForm = () => {
    handleFetchFilms(); // Fetch films when creating a new filmCategory
    handleFetchCategories(); // Fetch stores when creating a new filmCategory
    setShowCreateForm(true);
  };

  const handleFetchFilmCategories = () => {
    setShowFilmList(true);
    fetchFilmCategories();
  };

  return (
    <div>
      <h1>FilmCategory Page</h1>

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

      <button onClick={() => handleFetchFilmCategories()}>
        Fetch Categories
      </button>

      {!showCreateForm ? (
        <>
          {showFilmList && (
            <>
              <h2>FilmCategories</h2>{" "}
              <ul>
                {filmCategories.map((filmCategory) => (
                  <li key={filmCategory.category_id}>
                    <>
                      {`${filmCategory.name}`}

                      <button
                        onClick={() =>
                          handleDeleteFilmCategory(filmCategory.category_id)
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
            Create New FilmCategory
          </button> */}
          <button onClick={handleShowCreateForm}>
            Create New FilmCategory
          </button>
        </>
      ) : (
        <>
          <h2>Create FilmCategory</h2>

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
            onChange={handleCategorySearch} // Handle input change event
          />

          <select ref={categoryRef}>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {`${category.name}`}
              </option>
            ))}
          </select>

          {/* <input
            type="text"
            value={newFilmCategoryName}
            onChange={(e) => setNewFilmCategoryName(e.target.value)}
            placeholder="Enter filmCategory name"
          /> */}
          <button onClick={handleCreateFilmCategory}>Create</button>
          <button onClick={() => setShowCreateForm(false)}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default FilmCategory;
