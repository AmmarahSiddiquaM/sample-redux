import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DebounceInput } from "react-debounce-input";
import axios from "axios";

const Staff = () => {
  const [staffs, setStaffs] = useState([]);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");

  //const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    fetchStaffs();
  }, [currentPage]); // Refetch staffs when currentPage changes

  const navigate = useNavigate();
  //const newStaffNameRef = useRef(null);
  const addressRef = useRef(null);
  const storeRef = useRef(null);

  const fetchStaffs = async () => {
    try {
      const response = await axios.get(`/staff?page=${currentPage}`);
      setStaffs(response.data.staff);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching staffs:", error);
    }
  };

  const handleCreateStaff = async () => {
    try {
      await axios.post("/staff", {
        //staff: newStaffName,
        address_id: addressRef.current.value,
        store_id: storeRef.current.value,
        first_name: newFirstName,
        last_name: newLastName,
        email: newEmail,
        username: newUserName,
      });
      //setNewStaffName("");
      setShowCreateForm(false);
      setCurrentPage(1); // Reset to first page after creating a new staff
    } catch (error) {
      console.error("Error creating staff:", error);
    }
  };

  const handleDeleteStaff = async (staffId) => {
    try {
      await axios.delete(`/staff/${staffId}`);
      //fetchStaffs(); // Refresh staff list
      setCurrentPage(1); // Reset to first page after deleting a  staff
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  // const handleUpdateStaff = async () => {
  //   try {
  //     await axios.put(`/staff/${selectedStaffId}`, {
  //       //staff: newStaffNameRef.current.value,
  //       film_id: addressRef.current.value,
  //       store_id: storeRef.current.value,
  //     });
  //     setSelectedStaffId(null);
  //     fetchStaffs(); // Refresh staff list
  //   } catch (error) {
  //     console.error("Error updating staff:", error);
  //   }
  // };

  const handleNavigateStaff = (id) => {
    navigate(`./${id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFetchAddresses = async () => {
    try {
      const response = await axios.get("/address");
      setAddresses(response.data.addresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleFetchStores = async () => {
    try {
      const response = await axios.get("/store");
      setStores(response.data.stores);
    } catch (error) {
      console.error("Error fetching store:", error);
    }
  };

  const handleAddressSearch = async (inputValue) => {
    try {
      const response = await axios.get(
        `/address/search?query=${inputValue.target.value}`
      );
      console.log("addresses:", response.data);
      setAddresses(response.data);
    } catch (error) {
      console.error("Error searching addresses:", error);
      return [];
    }
  };

  const handleStoreSearch = async (inputValue) => {
    try {
      const response = await axios.get(
        `/store/search?query=${inputValue.target.value}`
      );
      console.log("stores:", response.data);
      setStores(response.data);
    } catch (error) {
      console.error("Error searching addresses:", error);
      return [];
    }
  };

  const handleShowCreateForm = () => {
    handleFetchAddresses(); // Fetch addresses when creating a new staff
    handleFetchStores(); // Fetch stores when creating a new staff

    setShowCreateForm(true);
  };

  return (
    <div>
      {!showCreateForm ? (
        <>
          <h1>Staff Page</h1>
          <h2>Staffs</h2>

          <ul>
            {staffs.map((staff) => (
              <li key={staff.staff_id}>
                {/* {selectedStaffId === staff.staff_id ? (
                  <>
                    <input
                      type="text"
                      ref={newStaffNameRef}
                      placeholder={staff.staff}
                    />
                    <button
                      onClick={() => {
                        handleUpdateStaff();
                      }}
                    >
                      Done
                    </button>
                  </>
                ) : ( */}
                <>
                  {`${staff.first_name}, ${staff.last_name}`}
                  {`${staff.email}, ${staff.username}`}
                  {/* {staff.staff} {staff.film.film} */}
                  <button onClick={() => handleNavigateStaff(staff.staff_id)}>
                    View
                  </button>
                  <button onClick={() => handleDeleteStaff(staff.staff_id)}>
                    Delete
                  </button>
                  {/* <button
                      onClick={() =>
                        setSelectedStaffId(staff.staff_id)
                      }
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
            Create New Staff
          </button> */}
          <button onClick={handleShowCreateForm}>Create New Staff</button>
        </>
      ) : (
        <>
          <h2>Create Staff</h2>

          <DebounceInput
            type="text"
            placeholder="Search Address..."
            minLength={2} // Minimum number of characters before debounce triggers
            debounceTimeout={300} // Debounce timeout in milliseconds
            onChange={handleAddressSearch} // Handle input change event
          />

          <select ref={addressRef}>
            {addresses.map((address) => (
              <option key={address.address_id} value={address.address_id}>
                {address.address}
              </option>
            ))}
          </select>

          <DebounceInput
            type="text"
            placeholder="Search Store..."
            minLength={2} // Minimum number of characters before debounce triggers
            debounceTimeout={300} // Debounce timeout in milliseconds
            onChange={handleStoreSearch} // Handle input change event
          />

          <select ref={storeRef}>
            {stores.map((store) => (
              <option key={store.store_id} value={store.store_id}>
                {store.address.address}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={newFirstName}
            onChange={(e) => setNewFirstName(e.target.value)}
            placeholder="Enter staff name"
          />
          <input
            type="text"
            value={newLastName}
            onChange={(e) => setNewLastName(e.target.value)}
            placeholder="Enter staff name"
          />
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter staff email"
          />
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="Enter staff username"
          />
          <button onClick={handleCreateStaff}>Create</button>
          <button onClick={() => setShowCreateForm(false)}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default Staff;
