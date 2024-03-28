import { useEffect, useState } from "react";
import { useNavigate /*, useLocation*/ } from "react-router-dom";
import LoadingGIF from "../images/loading.gif";

export default function Redirection(/*{ path = "login" }*/) {
  const [count, setCount] = useState(1);
  const navigate = useNavigate();
  //const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount);
    }, 1000);
    // redirect once count is equal to 0
    count === 0 &&
      // navigate(`/${path}`, {
      //   state: location.pathname,
      // });
      navigate("/login");
    // cleanup
    return () => clearInterval(interval);
  }, [count]);

  return (
    <div
    // className="d-flex justify-content-center align-items-center"
    // style={{ height: "90vh" }}
    >
      <img src={LoadingGIF} alt="Loading" style={{ width: "400px" }} />
    </div>
  );
}
