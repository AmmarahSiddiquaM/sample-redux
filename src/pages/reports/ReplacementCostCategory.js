import { useState, useEffect } from "react";

import axios from "axios";

const ReplacementCostCategory = () => {
  const [replacementCost, setReplacementCost] = useState([]);

  useEffect(() => {
    fetchInventories();
  }, []);

  const fetchInventories = async () => {
    try {
      const response = await axios.get(
        `/report/replacement-cost/store-category`
      );
      setReplacementCost(response.data[0]);
      console.log(response.data[0]);
    } catch (error) {
      console.error("Error fetching replacementCost:", error);
    }
  };

  return (
    <div>
      <>
        <h1>Replacement Cost Report</h1>
        <h2>Category with Store RCs</h2>

        <ul>
          {replacementCost.map((rc, index) => (
            <li key={index}>
              <>
                {`Store ID: ${rc.store_id} Category: ${rc.category} Films: ${rc.films} Average Cost: ${rc.avg_replacement_cost} Total Cost: ${rc.total_replacement_cost}`}{" "}
              </>
            </li>
          ))}
        </ul>
      </>
    </div>
  );
};

export default ReplacementCostCategory;
