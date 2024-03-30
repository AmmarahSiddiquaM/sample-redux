import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const Language = () => {
  const [languages, setLanguages] = useState([]);
  const [newLanguageName, setNewLanguageName] = useState("");
  const [selectedLanguageId, setSelectedLanguageId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLanguages();
  }, [currentPage]); // Refetch languages when currentPage changes

  const navigate = useNavigate();
  const newLanguageNameRef = useRef(null);

  const fetchLanguages = async () => {
    try {
      const response = await axios.get(`/language?page=${currentPage}`);
      setLanguages(response.data.languages);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  const handleCreateLanguage = async () => {
    try {
      await axios.post("/language", { name: newLanguageName });
      setNewLanguageName("");
      setShowCreateForm(false);
      setCurrentPage(1); // Reset to first page after creating a new language
    } catch (error) {
      console.error("Error creating language:", error);
    }
  };

  const handleDeleteLanguage = async (languageId) => {
    try {
      await axios.delete(`/language/${languageId}`);
      //fetchLanguages(); // Refresh language list
      setCurrentPage(1); // Reset to first page after deleting a  language
    } catch (error) {
      console.error("Error deleting language:", error);
    }
  };

  const handleUpdateLanguage = async () => {
    try {
      await axios.put(`/language/${selectedLanguageId}`, {
        language: newLanguageNameRef.current.value,
      });
      setSelectedLanguageId(null);
      fetchLanguages(); // Refresh language list
    } catch (error) {
      console.error("Error updating language:", error);
    }
  };

  const handleNavigateLanguage = (id) => {
    navigate(`./${id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {!showCreateForm ? (
        <>
          <h1>Language Page</h1>
          <h2>Languages</h2>

          <ul>
            {languages.map((language) => (
              <li key={language.language_id}>
                {selectedLanguageId === language.language_id ? (
                  <>
                    <input
                      type="text"
                      ref={newLanguageNameRef}
                      placeholder={language.language}
                    />
                    <button
                      onClick={() => {
                        handleUpdateLanguage();
                      }}
                    >
                      Done
                    </button>
                  </>
                ) : (
                  <>
                    {language.name}{" "}
                    <button
                      onClick={() =>
                        handleNavigateLanguage(language.language_id)
                      }
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteLanguage(language.language_id)}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        setSelectedLanguageId(language.language_id)
                      }
                    >
                      Edit
                    </button>
                  </>
                )}
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
            Create New Language
          </button>
        </>
      ) : (
        <>
          <h2>Create Language</h2>
          <input
            type="text"
            value={newLanguageName}
            onChange={(e) => setNewLanguageName(e.target.value)}
            placeholder="Enter language name"
          />
          <button onClick={handleCreateLanguage}>Create</button>
          <button onClick={() => setShowCreateForm(false)}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default Language;
