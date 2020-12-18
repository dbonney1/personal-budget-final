import jwt from "express-jwt";
import React from "react";
import Hero from "../../components/Hero/Hero";
import NavItems from "../../components/Nav/NavItems/NavItems";
const logout = () => {
  // remove user's token upon logging out
  localStorage.removeItem("jwt");
  localStorage.removeItem("userEmail");
  return (
    <div>
      <NavItems />
      <Hero />
      <h1>Thanks for visiting!</h1>
      <h2>Successfully logged out.</h2>
    </div>
  );
};
export default logout;
