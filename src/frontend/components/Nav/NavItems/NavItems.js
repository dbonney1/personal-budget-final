import React, { useState } from "react";

import NavItem from "./NavItem/NavItem";
import classes from "./NavItems.module.css";

const NavItems = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [active, setActive] = useState("home");

  const token = localStorage.getItem("jwt");
  if (token && !loggedIn) {
    setLoggedIn(true);
  } else if (!token && loggedIn) {
    setLoggedIn(false);
  }
  if (!loggedIn) {
    return (
      <ul className={classes.NavItems}>
        <NavItem
          clicked={() => {
            setActive("home");
          }}
          active={active === "home"}
          link="/"
        >
          Home
        </NavItem>
        <NavItem
          clicked={() => {
            setActive("login");
          }}
          active={active === "login"}
          link="/login"
        >
          Login
        </NavItem>
        <NavItem
          clicked={() => {
            setActive("signup");
          }}
          active={active === "signup"}
          link="/signup"
        >
          signup
        </NavItem>
      </ul>
    );
  } else {
    return (
      <ul className={classes.NavItems}>
        <NavItem
          clicked={() => {
            setActive("home");
          }}
          active={active === "home"}
          link="/"
        >
          Home
        </NavItem>
        <NavItem
          clicked={() => {
            setActive("dashboard");
          }}
          active={active === "dashboard"}
          link="/dashboard"
        >
          Dashboard
        </NavItem>
        <NavItem
          clicked={() => {
            setActive("");
          }}
          link="/logout"
        >
          Logout
        </NavItem>
      </ul>
    );
  }
};

export default NavItems;
