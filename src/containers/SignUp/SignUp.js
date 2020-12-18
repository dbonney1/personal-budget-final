import React, { useState } from "react";
import Input from "../../UI/Input/Input";
import axios from "axios";
import Form from "../../utils/Form/Form";

import Hero from "../../components/Hero/Hero";
import NavItems from "../../components/Nav/NavItems/NavItems";

import classes from "./Login-Signup.module.css";

const SignUp = () => {
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
      .post("/api/signup", userData)
      .then((res) => {
        console.log(res.data);
        setMessage(res.data.msg);
        console.log(res.data);
        setMessageClass(classes.Success);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response.data);
          setMessage(err.response.data.msg);
          setMessageClass(classes.Error);
        } else {
          setMessage('Account could not be created');
          setMessageClass(classes.Error);
        }
      });
  };

  return (
    <div>
      <NavItems />
      <Hero />
      <div className={classes.UserData}>
        <h2>Sign Up!</h2>
        <Form submitHandler={submitHandler} submitValue="Sign Up">
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

export default SignUp;
