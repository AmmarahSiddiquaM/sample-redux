import { useState, useEffect /*, useRef*/ } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const Investor = () => {
  const [investors, setInvestors] = useState([]);
  const [newInvestorFirstName, setNewInvestorFirstName] = useState("");
  const [newInvestorLastName, setNewInvestorLastName] = useState("");
  const [newCompanyName, setCompanyName] = useState("");

  //const [selectedInvestorId, setSelectedInvestorId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchInvestors();
  }, [currentPage]); // Refetch investors when currentPage changes

  const navigate = useNavigate();
  //const newInvestorFirstNameRef = useRef(null);

  const fetchInvestors = async () => {
    try {
      const response = await axios.get(`/investor?page=${currentPage}`);
      setInvestors(response.data.investors);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching investors:", error);
    }
  };

  const handleCreateInvestor = async () => {
    try {
      await axios.post("/investor", {
        first_name: newInvestorFirstName,
        last_name: newInvestorLastName,
        company_name: newCompanyName,
      });
      setNewInvestorFirstName("");
      setNewInvestorLastName("");
      setCompanyName("");

      setShowCreateForm(false);
      fetchInvestors();
      setCurrentPage(1); // Reset to first page after creating a new investor
    } catch (error) {
      console.error("Error creating investor:", error);
    }
  };

  const handleDeleteInvestor = async (investorId) => {
    try {
      await axios.delete(`/investor/${investorId}`);
      //fetchInvestors(); // Refresh investor list
      setCurrentPage(1); // Reset to first page after deleting a  investor
    } catch (error) {
      console.error("Error deleting investor:", error);
    }
  };

  // const handleUpdateInvestor = async () => {
  //   try {
  //     await axios.put(`/investor/${selectedInvestorId}`, {
  //       investor: newInvestorFirstNameRef.current.value,
  //     });
  //     setSelectedInvestorId(null);
  //     fetchInvestors(); // Refresh investor list
  //   } catch (error) {
  //     console.error("Error updating investor:", error);
  //   }
  // };

  const handleNavigateInvestor = (id) => {
    navigate(`./${id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {!showCreateForm ? (
        <>
          <h1>Investor Page</h1>
          <h2>Investors</h2>

          <ul>
            {investors.map((investor) => (
              <li key={investor.investor_id}>
                {/* {selectedInvestorId === investor.investor_id ? (
                  <>
                    <input
                      type="text"
                      ref={newInvestorFirstNameRef}
                      placeholder={investor.investor}
                    />
                    <button
                      onClick={() => {
                        handleUpdateInvestor();
                      }}
                    >
                      Done
                    </button>
                  </>
                ) : ( */}
                <>
                  {`${investor.first_name}, ${investor.last_name}`}{" "}
                  <button
                    onClick={() => handleNavigateInvestor(investor.investor_id)}
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteInvestor(investor.investor_id)}
                  >
                    Delete
                  </button>
                  {/* <button onClick={() => setSelectedInvestorId(investor.investor_id)}>
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
            Create New Investor
          </button>
        </>
      ) : (
        <>
          <h2>Create Investor</h2>
          <input
            type="text"
            value={newInvestorFirstName}
            onChange={(e) => setNewInvestorFirstName(e.target.value)}
            placeholder="Enter investor first name"
          />
          <input
            type="text"
            value={newInvestorLastName}
            onChange={(e) => setNewInvestorLastName(e.target.value)}
            placeholder="Enter investor second name"
          />

          <input
            type="text"
            value={newCompanyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter investor company name"
          />
          <button onClick={handleCreateInvestor}>Create</button>
          <button onClick={() => setShowCreateForm(false)}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default Investor;
