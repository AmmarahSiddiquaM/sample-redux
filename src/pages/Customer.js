import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DebounceInput } from "react-debounce-input";
import axios from "axios";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newActiveStatus, setNewActiveStatus] = useState("");

  //const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, [currentPage]); // Refetch customers when currentPage changes

  const navigate = useNavigate();
  //const newCustomerNameRef = useRef(null);
  const addressRef = useRef(null);
  const storeRef = useRef(null);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`/customer?page=${currentPage}`);
      setCustomers(response.data.customers);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleCreateCustomer = async () => {
    try {
      await axios.post("/customer", {
        //customer: newCustomerName,
        address_id: addressRef.current.value,
        store_id: storeRef.current.value,
        first_name: newFirstName,
        last_name: newLastName,
        email: newEmail,
        active: newActiveStatus,
      });
      //setNewCustomerName("");
      setShowCreateForm(false);
      setCurrentPage(1); // Reset to first page after creating a new customer
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      await axios.delete(`/customer/${customerId}`);
      //fetchCustomers(); // Refresh customer list
      setCurrentPage(1); // Reset to first page after deleting a  customer
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  // const handleUpdateCustomer = async () => {
  //   try {
  //     await axios.put(`/customer/${selectedCustomerId}`, {
  //       //customer: newCustomerNameRef.current.value,
  //       film_id: addressRef.current.value,
  //       store_id: storeRef.current.value,
  //     });
  //     setSelectedCustomerId(null);
  //     fetchCustomers(); // Refresh customer list
  //   } catch (error) {
  //     console.error("Error updating customer:", error);
  //   }
  // };

  const handleNavigateCustomer = (id) => {
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
    handleFetchAddresses(); // Fetch addresses when creating a new customer
    handleFetchStores(); // Fetch stores when creating a new customer

    setShowCreateForm(true);
  };

  return (
    <div>
      {!showCreateForm ? (
        <>
          <h1>Customer Page</h1>
          <h2>Customers</h2>

          <ul>
            {customers.map((customer) => (
              <li key={customer.customer_id}>
                {/* {selectedCustomerId === customer.customer_id ? (
                  <>
                    <input
                      type="text"
                      ref={newCustomerNameRef}
                      placeholder={customer.customer}
                    />
                    <button
                      onClick={() => {
                        handleUpdateCustomer();
                      }}
                    >
                      Done
                    </button>
                  </>
                ) : ( */}
                <>
                  {`${customer.first_name}, ${customer.last_name}`}
                  {`${customer.email}, ${customer.active}`}
                  {/* {customer.customer} {customer.film.film} */}
                  <button
                    onClick={() => handleNavigateCustomer(customer.customer_id)}
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(customer.customer_id)}
                  >
                    Delete
                  </button>
                  {/* <button
                      onClick={() =>
                        setSelectedCustomerId(customer.customer_id)
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
            Create New Customer
          </button> */}
          <button onClick={handleShowCreateForm}>Create New Customer</button>
        </>
      ) : (
        <>
          <h2>Create Customer</h2>

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
            placeholder="Enter customer name"
          />
          <input
            type="text"
            value={newLastName}
            onChange={(e) => setNewLastName(e.target.value)}
            placeholder="Enter customer name"
          />
          <input
            type="text"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter customer email"
          />
          <input
            type="checkbox"
            value={newActiveStatus}
            onChange={(e) => setNewActiveStatus(e.target.checked)}
            placeholder="Enter customer status"
          />
          <button onClick={handleCreateCustomer}>Create</button>
          <button onClick={() => setShowCreateForm(false)}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default Customer;
