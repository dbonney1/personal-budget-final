import React, { useState } from "react";
import Input from "../../UI/Input/Input";
import axios from "axios";
import Form from "../../utils/Form/Form";

import Hero from "../../components/Hero/Hero";
import NavItems from "../../components/Nav/NavItems/NavItems";
import classes from "./Login-Signup.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");

  const submitHandler = (event) => {
    event.preventDefault();
    const userData = {
      email: email,
      password: password,
    };

    axios
      .post("/api/login", userData)
      .then((res) => {
        console.log(res);
        if (res && res.data && res.data.success) {
          const token = res.data.token;
          const userEmail = res.data.results[0].email;
          localStorage.setItem("jwt", token);
          localStorage.setItem("userEmail", userEmail);
          setMessage(res.data.msg);
          console.log(res.data);
          setMessageClass(classes.Success);
        } 
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response.data);
          setMessage(err.response.data.msg);
          setMessageClass(classes.Error);
        }
      });
  };

  return (
    <div>
      <NavItems />
      <Hero />
      <div className={classes.UserData}>
        <h2>Login</h2>
        <Form
          submitClass={classes.Submit}
          submitHandler={submitHandler}
          submitValue="Login"
        >
          <h3>Username</h3>
          <Input
            inputClass={classes.Input}
            type="text"
            name="email"
            change={(event) => setEmail(event.target.value)}
            value={email}
          />
          <h3>Password</h3>
          <Input
            inputClass={classes.Input}
            className={classes.Input}
            type="password"
            name="password"
            change={(event) => setPassword(event.target.value)}
            value={password}
          />
        </Form>
        <div className={messageClass}>{message}</div>
      </div>
    </div>
  );
};

export default Login;
