import { useState, useEffect } from "react";

import axios from "axios";

const InvestorAdvisor = () => {
  const [investorAdvisor, setInvestorAdvisor] = useState([]);

  useEffect(() => {
    fetchInvestorAdvisor();
  }, []);

  const fetchInvestorAdvisor = async () => {
    try {
      const response = await axios.get(`/report/investor-advisor`);
      setInvestorAdvisor(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching investorAdvisor:", error);
    }
  };

  return (
    <div>
      <>
        <h1>Investor Advisor Report</h1>

        <ul>
          {investorAdvisor.map((person, index) => (
            <li key={index}>
              <>
                {` Name: ${person.first_name} ${person.last_name}, Type: ${person.type}`}
                {person.company_name && (
                  <> {`  Company: ${person.company_name}`}</>
                )}
              </>
            </li>
          ))}
        </ul>
      </>
    </div>
  );
};

export default InvestorAdvisor;
