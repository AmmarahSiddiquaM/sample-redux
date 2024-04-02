import { useState, useEffect, useRef } from "react";
//import { useNavigate } from "react-router-dom";
import { DebounceInput } from "react-debounce-input";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Rental = () => {
  const [rentals, setRentals] = useState([]);
  const [selectedRentalId, setSelectedRentalId] = useState(null);

  const [rentalDate, setRentalDate] = useState("");
  //const [newRentalDate, setNewRentalDate] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [inventory, setInventory] = useState([]);
  const [staff, setStaff] = useState([]);
  const [customer, setCustomer] = useState([]);

  useEffect(() => {
    fetchRentals();
  }, [currentPage]); // Refetch rentals when currentPage changes

  //const navigate = useNavigate();
  const inventoryRef = useRef(null);
  const staffRef = useRef(null);
  const customerRef = useRef(null);
  //const returnRef = useRef(null);

  const fetchRentals = async () => {
    try {
      const response = await axios.get(`/rental?page=${currentPage}`);
      setRentals(response.data.rentals);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching rentals:", error);
    }
  };

  const handleCreateRental = async () => {
    try {
      await axios.post("/rental", {
        inventory_id: inventoryRef.current.value,
        staff_id: staffRef.current.value,
        customer_id: customerRef.current.value,
        //return_date: newRentalDate,
        rental_date: new Date(),
      });
      //setNewRentalDate("");
      setShowCreateForm(false);
      setCurrentPage(1); // Reset to first page after creating a new inventory
    } catch (error) {
      console.error("Error creating rental:", error);
    }
  };

  const handleDeleteRental = async (inventoryId) => {
    try {
      await axios.delete(`/rental/${inventoryId}`);
      //fetchRentals(); // Refresh inventory list
      setCurrentPage(1); // Reset to first page after deleting a  inventory
    } catch (error) {
      console.error("Error deleting rental:", error);
    }
  };

  const handleUpdateRental = async () => {
    try {
      await axios.put(`/rental/${selectedRentalId}`, {
        return_date: rentalDate,
      });
      setSelectedRentalId(null);
      fetchRentals(); // Refresh inventory list
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  };

  // const handleNavigateRental = (id) => {
  //   navigate(`./${id}`);
  // };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFetchInventory = async () => {
    try {
      const response = await axios.get("/inventory/instock");
      setInventory(response.data.inventories);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const handleFetchStaffs = async () => {
    try {
      const response = await axios.get("/staff");
      setStaff(response.data.staff);
    } catch (error) {
      console.error("Error fetching store:", error);
    }
  };

  const handleFetchCustomer = async () => {
    try {
      const response = await axios.get("/customer");
      setCustomer(response.data.customers);
    } catch (error) {
      console.error("Error fetching store:", error);
    }
  };

  const handleInventorySearch = async (inputValue) => {
    try {
      const response = await axios.get(
        `/inventory/instock?query=${inputValue.target.value}`
      );
      console.log("inventory:", response.data);
      setInventory(response.data);
    } catch (error) {
      console.error("Error searching inventory:", error);
      return [];
    }
  };

  const handleStaffSearch = async (inputValue) => {
    try {
      const response = await axios.get(
        `/store/search?query=${inputValue.target.value}`
      );
      console.log("staff:", response.data);
      setStaff(response.data);
    } catch (error) {
      console.error("Error searching inventory:", error);
      return [];
    }
  };

  const handleCustomerSearch = async (inputValue) => {
    try {
      const response = await axios.get(
        `/customer/search?query=${inputValue.target.value}`
      );
      console.log("customer:", response.data);
      setCustomer(response.data);
    } catch (error) {
      console.error("Error searching inventory:", error);
      return [];
    }
  };

  const handleShowCreateForm = () => {
    handleFetchInventory(); // Fetch inventory when creating a new inventory
    handleFetchStaffs(); // Fetch staff when creating a new inventory
    handleFetchCustomer();
    setShowCreateForm(true);
  };

  return (
    <div>
      {!showCreateForm ? (
        <>
          <h1>Rental Page</h1>
          <h2>Rentals</h2>

          <ul>
            {rentals.map((rental) => (
              <li key={rental.rental_id}>
                {selectedRentalId === rental.rental_id ? (
                  <>
                    <DatePicker
                      selected={rentalDate}
                      onChange={setRentalDate}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select a date"
                    />
                    <button
                      onClick={() => {
                        handleUpdateRental();
                      }}
                    >
                      Done
                    </button>
                  </>
                ) : (
                  <>
                    {`${rental.inventory.film.title}, ${rental.customer.email}`}
                    {/* <button
                    onClick={() => handleNavigateRental(rental.rental_id)}
                  >
                    View
                  </button> */}
                    <button
                      onClick={() => handleDeleteRental(rental.rental_id)}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRentalId(rental.rental_id);
                        setRentalDate(rental.return_date);
                      }}
                    >
                      Edit
                    </button>
                  </>
                )}
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
            Create New Rental
          </button> */}
          <button onClick={handleShowCreateForm}>Create New Rental</button>
        </>
      ) : (
        <>
          <h2>Create Rental</h2>

          <DebounceInput
            type="text"
            placeholder="Search..."
            minLength={2} // Minimum number of characters before debounce triggers
            debounceTimeout={300} // Debounce timeout in milliseconds
            onChange={handleInventorySearch} // Handle input change event
          />

          <select ref={inventoryRef}>
            {inventory.map((inventory) => (
              <option
                key={inventory.inventory_id}
                value={inventory.inventory_id}
              >
                {inventory.film.title}
              </option>
            ))}
          </select>

          <DebounceInput
            type="text"
            placeholder="Search..."
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

          <DebounceInput
            type="text"
            placeholder="Search..."
            minLength={2} // Minimum number of characters before debounce triggers
            debounceTimeout={300} // Debounce timeout in milliseconds
            onChange={handleCustomerSearch} // Handle input change event
          />

          <select ref={customerRef}>
            {customer.map((customer) => (
              <option key={customer.customer_id} value={customer.customer_id}>
                {`${customer.email}, ${customer.address.address}`}
              </option>
            ))}
          </select>

          {/* <DatePicker
            //selected={newRentalDate}
            //onChange={setNewRentalDate}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select a date"
          /> */}
          <button onClick={handleCreateRental}>Create</button>
          <button onClick={() => setShowCreateForm(false)}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default Rental;
