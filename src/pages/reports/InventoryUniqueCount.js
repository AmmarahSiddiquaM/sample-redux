import { useState, useEffect } from "react";

import axios from "axios";

const Inventory = () => {
  const [inventories, setInventories] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState("");

  useEffect(() => {
    fetchInventories();
  }, []);

  const fetchInventories = async () => {
    try {
      const response = await axios.get(`/report/inventory/unique-count`);
      setInventories(response.data.unique_films_per_store);
      setUniqueCategories(response.data.unique_category_count);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching inventories:", error);
    }
  };

  return (
    <div>
      <>
        <h1>Inventory Count Report</h1>
        <h2>Unique Inventory</h2>

        <p>{`Unique Categories: ${uniqueCategories}`}</p>

        <ul>
          {inventories.map((inventory, index) => (
            <li key={index}>
              <>
                {`Store ID: ${inventory.store_id} Store Address: ${inventory.store.address.address} Unique Films: ${inventory.unique_films} `}{" "}
              </>
            </li>
          ))}
        </ul>
      </>
    </div>
  );
};

export default Inventory;
