import { useState, useEffect } from "react";

import axios from "axios";

const ReplacementCost = () => {
  const [replacementCost, setReplacementCost] = useState({});

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`/report/replacement-cost`);
      setReplacementCost(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  return (
    <div>
      <>
        <h1>Replacement Cost Report</h1>
        <h2>Replacement Costs</h2>

        <p>{`Least Expensive RC: ${replacementCost.least_expensive}`} </p>
        <p>{`Most Expensive RC: ${replacementCost.most_expensive}`} </p>
        <p>{`Average RC: ${replacementCost.average_replacement_cost}`} </p>
      </>
    </div>
  );
};

export default ReplacementCost;
