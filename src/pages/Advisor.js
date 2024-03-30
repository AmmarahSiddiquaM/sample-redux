import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const Advisor = () => {
  const [advisors, setAdvisors] = useState([]);
  const [newAdvisorFirstName, setNewAdvisorFirstName] = useState("");
  const [newAdvisorLastName, setNewAdvisorLastName] = useState("");
  const [isChairman, setIsChairman] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAdvisors();
  }, [currentPage]); // Refetch advisors when currentPage changes

  const navigate = useNavigate();

  const fetchAdvisors = async () => {
    try {
      const response = await axios.get(`/advisor?page=${currentPage}`);
      setAdvisors(response.data.advisors);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching sors:", error);
    }
  };

  const handleCreateAdvisor = async () => {
    try {
      await axios.post("/advisor", {
        first_name: newAdvisorFirstName,
        last_name: newAdvisorLastName,
        is_chairmain: isChairman,
      });
      setNewAdvisorFirstName("");
      setNewAdvisorLastName("");

      setShowCreateForm(false);
      fetchAdvisors();
      setCurrentPage(1); // Reset to first page after creating a new advisor
    } catch (error) {
      console.error("Error creating advisor:", error);
    }
  };

  const handleDeleteAdvisor = async (advisorId) => {
    try {
      await axios.delete(`/advisor/${advisorId}`);
      //fetchAdvisors(); // Refresh advisor list
      setCurrentPage(1); // Reset to first page after deleting a  advisor
    } catch (error) {
      console.error("Error deleting advisor:", error);
    }
  };

  const handleNavigateAdvisor = (id) => {
    navigate(`./${id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {!showCreateForm ? (
        <>
          <h1>Advisor Page</h1>
          <h2>Advisors</h2>

          <ul>
            {advisors.map((advisor) => (
              <li key={advisor.advisor_id}>
                <>
                  {`${advisor.first_name}, ${advisor.last_name}`}{" "}
                  <button
                    onClick={() => handleNavigateAdvisor(advisor.advisor_id)}
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteAdvisor(advisor.advisor_id)}
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

          <button onClick={() => setShowCreateForm(true)}>
            Create New Advisor
          </button>
        </>
      ) : (
        <>
          <h2>Create Advisor</h2>
          <input
            type="text"
            value={newAdvisorFirstName}
            onChange={(e) => setNewAdvisorFirstName(e.target.value)}
            placeholder="Enter advisor first name"
          />
          <input
            type="text"
            value={newAdvisorLastName}
            onChange={(e) => setNewAdvisorLastName(e.target.value)}
            placeholder="Enter advisor second name"
          />

          <input
            type="checkbox"
            //value={newAdvisorLastName}
            onChange={(e) => setIsChairman(e.target.checked)}
            placeholder="Enter advisor second name"
          />
          <button onClick={handleCreateAdvisor}>Create</button>
          <button onClick={() => setShowCreateForm(false)}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default Advisor;
