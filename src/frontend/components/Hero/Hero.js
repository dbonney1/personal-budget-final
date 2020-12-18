import React from "react";
import Particles from "react-particles-js";

import classes from "./Hero.module.css";
const hero = () => {
  // include React Particles in hero along with title
  return (
    <div>
      <header className={classes.Hero}>
        <div className={classes.Particles}>
          <Particles
            height={"350px"}
            params={{
              particles: {
                number: {
                  value: 50,
                },
                line_linked: {
                  shadow: {
                    enable: true,
                    color: "#A17848",
                    blur: 20,
                  },
                },
              },
              size: {
                value: 3,
              },
              interactivity: {
                events: {
                  onhover: {
                    enable: true,
                    mode: "repulse",
                  },
                },
              },
            }}
          />
          <div className={classes.Label}>
            <h1>Personal Budget</h1>
            <h2>Your Comfy Budget Management App</h2>
          </div>
        </div>
      </header>
    </div>
  );
};

export default hero;
