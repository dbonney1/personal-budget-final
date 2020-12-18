import React from "react";

import classes from "./NavItem.module.css";
import { Link } from "react-router-dom";

// a single navigation item with a Link
const navItem = (props) => {
  return (
    <li className={classes.NavItem}>
      <Link to={props.link}>
        {props.children}
      </Link>
    </li>
  );
};

export default navItem;
