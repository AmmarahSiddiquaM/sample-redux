import { useState, useEffect } from "react";

import axios from "axios";

const Email = () => {
  const [emailCount, setEmailCount] = useState({});

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`/report/customer/email-count`);
      setEmailCount(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  return (
    <div>
      <>
        <h1>Emails Report</h1>
        <h2>Email Count</h2>

        <p>{`Email Count: ${emailCount.emails}`} </p>
      </>
    </div>
  );
};

export default Email;
