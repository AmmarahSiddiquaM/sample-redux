import { useState, useEffect } from "react";

import axios from "axios";

const PaymentAverage = () => {
  const [paymentAverage, setPaymentAverage] = useState({});

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`/report/payment-average`);
      setPaymentAverage(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  return (
    <div>
      <>
        <h1>Payment Report</h1>
        <h2>Payment Averages</h2>

        <p>{`Max Payment: ${paymentAverage.max_payment}`} </p>
        <p>{`Average Payment: ${paymentAverage.average_payment}`} </p>
      </>
    </div>
  );
};

export default PaymentAverage;
