import React from "react";
import "./App.css";
import HomePage from "./containers/HomePage/HomePage";
import Dashboard from "./containers/Dashboard/Dashboard";
import SignUp from "./containers/SignUp/SignUp";
import Login from "./containers/SignUp/Login";
import Logout from "./containers/Logout/Logout";
import Layout from "./hoc/Layout/Layout";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Switch>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/signup">
              <SignUp />
            </Route>
            <Route path="/logout">
              <Logout />
            </Route>
            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
