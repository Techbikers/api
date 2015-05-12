import React, { Component } from "react";
import forms from 'newforms';

class FormField extends Component {
  static propTypes = {
    field: React.PropTypes.object.isRequired
  }

  static defaultProps = {
    className: ""
  }

  render() {
    let { field } = this.props;
    if (field.field instanceof forms.BooleanField) {
      return (
        <div className={this.props.className + " form-field " + field.status()}>
           <label>{field.render()} {field.label}</label>
        </div>
      );
    }
    else {
      return (
        <div className={this.props.className + " form-field " + field.status()}>
          {field.render({attrs: {placeholder: field.label}})}
        </div>
      );
    }
  }
}

export default FormField;