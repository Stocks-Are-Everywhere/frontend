import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  return (
    <h1
      className="text-2xl font-bold cursor-pointer"
      onClick={() => navigate("/")}
    >
      온세주
    </h1>
  );
};

export default Logo;
