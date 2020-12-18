import React from "react";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import Article from "../../components/Article/Article";
import budgetImg1 from "../../images/bills.jpeg";
import classes from "./HomePage.module.css";
import NavItems from "../../components/Nav/NavItems/NavItems";
import Hero from "../../components/Hero/Hero";

const homepage = () => {
  // homepage includes exclusively static data
  return (
    <Aux>
      <NavItems />
      <Hero />
      <div className={classes.HomePage}>
        <div className={classes.Container}>
          <div className={classes.InfoBlock}>
            <h1>The Number One Budget Management App</h1>
            <Article>
              This absolutely awesome budget management application provides you
              with the tools you need to ensure you can track and monitor your
              monthly budgets and determine how closely you're adhering to it by
              providing your expenses month by month. Why would you ever want
              anything else?
            </Article>
          </div>
          <img src={budgetImg1} className={classes.Image} alt="Budget Image" />
          <div className={classes.InfoBlock}>
            <h1>Many Tools At Your Dispense</h1>
            <Article>
              By creating an account, this budget application provides you with
              the ability to create your own monthly budgets, and through the
              dashboard you will be able to view your budget allocation through
              a pie chart, bar graph and line graph. Sign up today!
            </Article>
          </div>
        </div>
      </div>
    </Aux>
  );
};

export default homepage;
