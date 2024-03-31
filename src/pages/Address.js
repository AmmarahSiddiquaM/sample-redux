import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DebounceInput } from "react-debounce-input";
import axios from "axios";

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [newAddressLine2, setNewAddressLine2] = useState("");
  const [newDistrict, setNewDistrict] = useState("");
  const [newPostalcode, setNewPostalcode] = useState("");
  const [newPhone, setNewPhone] = useState("");
  //const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetchAddresses();
  }, [currentPage]); // Refetch addresses when currentPage changes

  const navigate = useNavigate();
  //const newAddressRef = useRef(null);
  const cityRef = useRef(null);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(`/address?page=${currentPage}`);
      setAddresses(response.data.addresses);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleCreateAddress = async () => {
    try {
      await axios.post("/address", {
        address: newAddress,
        city_id: cityRef.current.value,
        address2: newAddressLine2,
        district: newDistrict,
        postal_code: newPostalcode,
        phone: newPhone,
      });
      setNewAddress("");
      setShowCreateForm(false);
      setCurrentPage(1); // Reset to first page after creating a new address
    } catch (error) {
      console.error("Error creating address:", error);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await axios.delete(`/address/${addressId}`);
      //fetchAddresses(); // Refresh address list
      setCurrentPage(1); // Reset to first page after deleting a  address
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  // const handleUpdateAddress = async () => {
  //   try {
  //     await axios.put(`/address/${selectedAddressId}`, {
  //       address: newAddressRef.current.value,
  //     });
  //     setSelectedAddressId(null);
  //     fetchAddresses(); // Refresh address list
  //   } catch (error) {
  //     console.error("Error updating address:", error);
  //   }
  // };

  const handleNavigateAddress = (id) => {
    navigate(`./${id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFetchCities = async () => {
    try {
      const response = await axios.get("/city");
      setCities(response.data.cities);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleCitySearch = async (inputValue) => {
    try {
      const response = await axios.get(
        `/city/search?query=${inputValue.target.value}`
      );
      //console.log("cities:", response.data);
      setCities(response.data);
    } catch (error) {
      console.error("Error searching cities:", error);
      return [];
    }
  };

  const handleShowCreateForm = () => {
    handleFetchCities(); // Fetch cities when creating a new address
    setShowCreateForm(true);
  };

  return (
    <div>
      {!showCreateForm ? (
        <>
          <h1>Address Page</h1>
          <h2>Addresses</h2>

          <ul>
            {addresses.map((address) => (
              <li key={address.address_id}>
                {/* {selectedAddressId === address.address_id ? (
                  <>
                    <input
                      type="text"
                      ref={newAddressRef}
                      placeholder={address.address}
                    />
                    <button
                      onClick={() => {
                        handleUpdateAddress();
                      }}
                    >
                      Done
                    </button>
                  </>
                ) : ( */}
                <>
                  {`${address.address}, ${address.city.city}`}
                  {/* {address.address} {address.city.city} */}
                  <button
                    onClick={() => handleNavigateAddress(address.address_id)}
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.address_id)}
                  >
                    Delete
                  </button>
                  {/* <button
                      onClick={() => setSelectedAddressId(address.address_id)}
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
            Create New Address
          </button> */}
          <button onClick={handleShowCreateForm}>Create New Address</button>
        </>
      ) : (
        <>
          <h2>Create Address</h2>

          <DebounceInput
            type="text"
            placeholder="Search..."
            minLength={2} // Minimum number of characters before debounce triggers
            debounceTimeout={300} // Debounce timeout in milliseconds
            onChange={handleCitySearch} // Handle input change event
          />

          <select ref={cityRef}>
            {cities.map((city) => (
              <option key={city.city_id} value={city.city_id}>
                {city.city}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            placeholder="Enter address "
          />

          <input
            type="text"
            value={newAddressLine2}
            onChange={(e) => setNewAddressLine2(e.target.value)}
            placeholder="Enter address line 2"
          />
          <input
            type="text"
            value={newDistrict}
            onChange={(e) => setNewDistrict(e.target.value)}
            placeholder="Enter district"
          />
          <input
            type="text"
            value={newPostalcode}
            onChange={(e) => setNewPostalcode(e.target.value)}
            placeholder="Enter postal code"
          />
          <input
            type="text"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            placeholder="Enter phone"
          />
          <button onClick={handleCreateAddress}>Create</button>
          <button onClick={() => setShowCreateForm(false)}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default Address;
