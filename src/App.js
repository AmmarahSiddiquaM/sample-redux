import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/customer")
      .then((response) => response.json())
      .then((data) => setCustomers(data))
      .catch((error) => console.error("Error fetching customers:", error));
  }, []);

  return (
    <div className="App">
      <h1>Hello from Sakila Client!</h1>
      <h3>Customer List</h3>
      <ul>
        {customers.map((customer) => (
          <li key={customer.customer_id}>{customer.first_name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
