import { useState, useEffect } from "react";

import axios from "axios";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCustomers();
  }, [currentPage]); // Refetch customers when currentPage changes

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        `/report/customer/rentals?page=${currentPage}`
      );
      setCustomers(response.data.customers);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <>
        <h1>Customer Rental Report</h1>
        <h2>Customers Rentals</h2>

        <ul>
          {customers[0].map((customer, index) => (
            <li key={index}>
              <>
                {`Customer: ${customer.first_name} ${customer.last_name} Total Rentals: ${customer.total_rentals} Total Payment Amount: ${customer.total_payment_amount}`}{" "}
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
    </div>
  );
};

export default Customer;
