import React from "react";
import Aux from "../Auxiliary/Auxiliary";
import classes from "./Layout.module.css";
import Hero from "../../components/Hero/Hero";
import NavItems from "../../components/Nav/NavItems/NavItems";
const layout = (props) => {
  return (
    <Aux>
      <main className={classes.Content}>
        {props.children}
      </main>
    </Aux>
  );
};

export default layout;
