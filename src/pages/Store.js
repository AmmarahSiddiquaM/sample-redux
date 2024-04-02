import { useState, useEffect, useRef } from "react";
//import { useNavigate } from "react-router-dom";
import { DebounceInput } from "react-debounce-input";
import axios from "axios";

const Store = () => {
  const [stores, setStores] = useState([]);

  //const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    fetchStores();
  }, [currentPage]); // Refetch stores when currentPage changes

  //const navigate = useNavigate();
  //const newStoreNameRef = useRef(null);
  const addressRef = useRef(null);
  const staffRef = useRef(null);

  const fetchStores = async () => {
    try {
      const response = await axios.get(`/store?page=${currentPage}`);
      setStores(response.data.stores);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const handleCreateStore = async () => {
    try {
      const created_store = await axios.post("/store", {
        //store: newStoreName,
        address_id: addressRef.current.value,
        manager_staff_id: staffRef.current.value,
      });

      console.log("cs: ", created_store.data.store_id);

      await axios.put(`/staff/${staffRef.current.value}`, {
        //store: newStoreName,
        store_id: created_store.data.store_id,
      });
      //setNewStoreName("");
      setShowCreateForm(false);
      setCurrentPage(1); // Reset to first page after creating a new store
    } catch (error) {
      console.error("Error creating store:", error);
    }
  };

  // const handleDeleteStore = async (storeId) => {
  //   try {
  //     await axios.delete(`/store/${storeId}`);
  //     //fetchStores(); // Refresh store list
  //     setCurrentPage(1); // Reset to first page after deleting a  store
  //   } catch (error) {
  //     console.error("Error deleting store:", error);
  //   }
  // };

  // const handleUpdateStore = async () => {
  //   try {
  //     await axios.put(`/store/${selectedStoreId}`, {
  //       //store: newStoreNameRef.current.value,
  //       film_id: addressRef.current.value,
  //       store_id: staffRef.current.value,
  //     });
  //     setSelectedStoreId(null);
  //     fetchStores(); // Refresh store list
  //   } catch (error) {
  //     console.error("Error updating store:", error);
  //   }
  // };

  // const handleNavigateStore = (id) => {
  //   navigate(`./${id}`);
  // };

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

  const handleFetchStaff = async () => {
    try {
      const response = await axios.get("/staff/notmanager?first_name=A");
      setStaff(response.data);
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

  const handleStaffSearch = async (inputValue) => {
    console.log("hi");
    try {
      const response = await axios.get(
        `/staff/notmanager?query=${inputValue.target.value}`
      );
      console.log("staff:", response.data);
      setStaff(response.data);
    } catch (error) {
      console.error("Error searching addresses:", error);
      return [];
    }
  };

  const handleShowCreateForm = () => {
    handleFetchAddresses(); // Fetch addresses when creating a new store
    handleFetchStaff(); // Fetch stores when creating a new store

    setShowCreateForm(true);
  };

  return (
    <div>
      {!showCreateForm ? (
        <>
          <h1>Store Page</h1>
          <h2>Stores</h2>

          <ul>
            {stores.map((store) => (
              <li key={store.store_id}>
                {/* {selectedStoreId === store.store_id ? (
                  <>
                    <input
                      type="text"
                      ref={newStoreNameRef}
                      placeholder={store.store}
                    />
                    <button
                      onClick={() => {
                        handleUpdateStore();
                      }}
                    >
                      Done
                    </button>
                  </>
                ) : ( */}
                <>
                  {`${store.address.address}, `}
                  {`${
                    store.staffs.find((obj) => {
                      return obj["staff_id"] == store["manager_staff_id"];
                    })?.first_name
                  }, ${
                    store.staffs.find((obj) => {
                      return obj["staff_id"] == store["manager_staff_id"];
                    })?.last_name
                  }`}

                  {/* {console.log(
                    "lo",
                    store.staffs.find((obj) => {
                      return obj["staff_id"] == store["manager_staff_id"];
                    })
                  )} */}

                  {/* {store.store} {store.film.film} */}
                  {/* <button onClick={() => handleNavigateStore(store.store_id)}>
                    View
                  </button> */}

                  {/* Commented due to schema restriction in DB */}
                  {/* <button onClick={() => handleDeleteStore(store.store_id)}>
                    Delete
                  </button> */}
                  {/* <button
                      onClick={() =>
                        setSelectedStoreId(store.store_id)
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
            Create New Store
          </button> */}
          <button onClick={handleShowCreateForm}>Create New Store</button>
        </>
      ) : (
        <>
          <h2>Create Store</h2>

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
            placeholder="Search Staff..."
            minLength={2} // Minimum number of characters before debounce triggers
            debounceTimeout={300} // Debounce timeout in milliseconds
            onChange={handleStaffSearch} // Handle input change event
          />

          <select ref={staffRef}>
            {staff.map((staff) => (
              <option key={staff.staff_id} value={staff.staff_id}>
                {staff.first_name}
              </option>
            ))}
          </select>

          <button onClick={handleCreateStore}>Create</button>
          <button onClick={() => setShowCreateForm(false)}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default Store;
