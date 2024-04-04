import { useState, useEffect } from "react";

import axios from "axios";

const ActorAward = () => {
  const [actorAward, setActorAward] = useState([]);

  useEffect(() => {
    fetchInvestorAdvisor();
  }, []);

  const fetchInvestorAdvisor = async () => {
    try {
      const response = await axios.get(`/report/actor-award-stats`);
      setActorAward(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching actorAward:", error);
    }
  };

  return (
    <div>
      <>
        <h1>Actor Award Report</h1>

        <ul>
          {actorAward.map((award, index) => (
            <li key={index}>
              <>
                {` Number of Awards: ${award.number_of_awards}, Ratio of Actors with atleast one movie: ${award.pct_w_one_film}`}
              </>
            </li>
          ))}
        </ul>
      </>
    </div>
  );
};

export default ActorAward;
