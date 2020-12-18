import React, { Component } from "react";

import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";

class Form extends Component {
  render() {
    return (
      <form className={this.props.submitClass} onSubmit={this.props.submitHandler}>
        {this.props.children}
        <input type="submit" value={this.props.submitValue} />
      </form>
    );
  }
}

export default Form;
