import { useState, useEffect } from "react";

import axios from "axios";

const Store = () => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await axios.get(`/report/store`);
      setStores(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  return (
    <div>
      <>
        <h1>Store Report</h1>
        <h2>Stores</h2>

        <ul>
          {stores.map((store, index) => (
            <li key={index}>
              <>
                {` Store Manager: ${store.manager_first_name} ${store.manager_last_name}, Store Address: ${store.address}, ${store.city}, ${store.country} `}{" "}
              </>
            </li>
          ))}
        </ul>
      </>
    </div>
  );
};

export default Store;
