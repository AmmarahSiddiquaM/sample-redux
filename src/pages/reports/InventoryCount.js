import { useState, useEffect } from "react";

import axios from "axios";

const Inventory = () => {
  const [inventories, setInventories] = useState([]);

  useEffect(() => {
    fetchInventories();
  }, []);

  const fetchInventories = async () => {
    try {
      const response = await axios.get(`/report/inventory-count`);
      setInventories(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching inventories:", error);
    }
  };

  return (
    <div>
      <>
        <h1>Inventory Count Report</h1>
        <h2>Inventory Counts</h2>

        <ul>
          {inventories.map((inventory, index) => (
            <li key={index}>
              <>
                {`Store ID: ${inventory.store_id} Store Address: ${inventory.store.address.address} Items: ${inventory.inventory_items} `}{" "}
              </>
            </li>
          ))}
        </ul>
      </>
    </div>
  );
};

export default Inventory;
