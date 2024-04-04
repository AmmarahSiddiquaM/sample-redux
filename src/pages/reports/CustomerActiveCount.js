import { useState, useEffect } from "react";

import axios from "axios";

const Customer = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`/report/customer/active-count`);
      setCustomers(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  return (
    <div>
      <>
        <h1>Customer Count Report</h1>
        <h2>Active Customers</h2>

        <ul>
          {customers.map((customer, index) => (
            <li key={index}>
              <>
                {`Store ID: ${customer.store_id} Store Address: ${customer.store.address.address} Active Customer: ${customer.active_customers} `}{" "}
              </>
            </li>
          ))}
        </ul>
      </>
    </div>
  );
};

export default Customer;
