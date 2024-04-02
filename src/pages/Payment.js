import { useState, useEffect, useRef } from "react";
//import { useNavigate } from "react-router-dom";
import { DebounceInput } from "react-debounce-input";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [selectedPaymentRentalId, setSelectedpaymentRentalId] = useState(null);
  const [paymentDate, setPaymentDate] = useState("");
  const [newPaymentDate, setNewPaymentDate] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [rental, setRental] = useState([]);
  const [staff, setStaff] = useState([]);
  const [customer, setCustomer] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, [currentPage]); // Refetch payments when currentPage changes

  //const navigate = useNavigate();
  //const newPaymentDateRef = useRef(null);
  const rentalRef = useRef(null);
  const staffRef = useRef(null);
  const customerRef = useRef(null);
  const amountRef = useRef("");

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`/payment?page=${currentPage}`);
      setPayments(response.data.payments);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const handleCreatePayment = async () => {
    try {
      await axios.post("/payment", {
        //rental: newPaymentDate,
        rental_id: rentalRef.current.value,
        staff_id: staffRef.current.value,
        customer_id: customerRef.current.value,
        amount: newAmount,
        payment_date: newPaymentDate,
      });

      await axios.put(`/rental/${rentalRef.current.value}`, {
        //rental: newPaymentDate,
        rental_date: newPaymentDate,
      });
      //setNewPaymentDate("");
      setShowCreateForm(false);
      setCurrentPage(1); // Reset to first page after creating a new rental
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  const handleDeletePayment = async (rentalId) => {
    try {
      await axios.delete(`/payment/${rentalId}`);
      //fetchPayments(); // Refresh rental list
      setCurrentPage(1); // Reset to first page after deleting a  rental
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  const handleUpdatePayment = async () => {
    try {
      await axios.put(`/payment/${selectedPaymentId}`, {
        payment_date: paymentDate,
        amount: amountRef.current.value,
      });

      await axios.put(`/rental/${selectedPaymentRentalId}`, {
        //rental: newPaymentDate,
        rental_date: paymentDate,
      });

      setSelectedPaymentId(null);
      fetchPayments(); // Refresh rental list
    } catch (error) {
      console.error("Error updating rental:", error);
    }
  };

  // const handleNavigatePayment = (id) => {
  //   navigate(`./${id}`);
  // };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFetchRental = async () => {
    try {
      const response = await axios.get("/rental/unreturned");
      setRental(response.data);
    } catch (error) {
      console.error("Error fetching rental:", error);
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

  // const handleRentalSearch = async (inputValue) => {
  //   try {
  //     const response = await axios.get(
  //       `/rental/unreturned?query=${inputValue.target.value}`
  //     );
  //     console.log("rental:", response.data);
  //     setRental(response.data);
  //   } catch (error) {
  //     console.error("Error searching rental:", error);
  //     return [];
  //   }
  // };

  const handleStaffSearch = async (inputValue) => {
    try {
      const response = await axios.get(
        `/store/search?query=${inputValue.target.value}`
      );
      console.log("staff:", response.data);
      setStaff(response.data);
    } catch (error) {
      console.error("Error searching rental:", error);
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
      console.error("Error searching rental:", error);
      return [];
    }
  };

  const handleShowCreateForm = () => {
    handleFetchRental(); // Fetch rental when creating a new rental
    handleFetchStaffs(); // Fetch staff when creating a new rental
    handleFetchCustomer();
    setShowCreateForm(true);
  };

  return (
    <div>
      {!showCreateForm ? (
        <>
          <h1>Payment Page</h1>
          <h2>Payments</h2>

          <ul>
            {payments.map((payment) => (
              <li key={payment.payment_id}>
                {selectedPaymentId === payment.payment_id ? (
                  <>
                    <input
                      type="text"
                      ref={amountRef}
                      placeholder={payment.amount}
                    />
                    <DatePicker
                      selected={paymentDate}
                      onChange={setPaymentDate}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select a date"
                    />
                    <button
                      onClick={() => {
                        handleUpdatePayment();
                      }}
                    >
                      Done
                    </button>
                  </>
                ) : (
                  <>
                    {`${payment.customer.email}, ${payment.rental.inventory.film.title}`}
                    {/* <button
                    onClick={() => handleNavigatePayment(payment.payment_id)}
                  >
                    View
                  </button> */}
                    <button
                      onClick={() => handleDeletePayment(payment.payment_id)}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPaymentId(payment.payment_id);
                        setSelectedpaymentRentalId(payment.rental_id);
                        setPaymentDate(payment.payment_date);
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
            Create New Payment
          </button> */}
          <button onClick={handleShowCreateForm}>Create New Payment</button>
        </>
      ) : (
        <>
          <h2>Create Payment</h2>

          {/* <DebounceInput
            type="text"
            placeholder="Search..."
            minLength={2} // Minimum number of characters before debounce triggers
            debounceTimeout={300} // Debounce timeout in milliseconds
            onChange={handleRentalSearch} // Handle input change event
          /> */}

          <select ref={rentalRef}>
            {rental.map((rental) => (
              <option key={rental.rental_id} value={rental.rental_id}>
                {`${rental.inventory.film.title}, ${rental.customer.email}`}
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

          {/* <input
            type="text"
            value={newPaymentDate}
            onChange={(e) => setNewPaymentDate(e.target.value)}
            placeholder="Enter rental name"
          /> */}

          <input
            type="text"
            onChange={(e) => setNewAmount(e.target.value)}
            placeholder="Enter rental amount"
          />

          <DatePicker
            selected={newPaymentDate}
            onChange={setNewPaymentDate}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select a date"
          />
          <button onClick={handleCreatePayment}>Create</button>
          <button onClick={() => setShowCreateForm(false)}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default Payment;
