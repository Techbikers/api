import React, { Component } from "react";
import forms from "newforms";

export default class FormField extends Component {
  static propTypes = {
    field: React.PropTypes.object.isRequired
  };

  static defaultProps = {
    className: ""
  };

  render() {
    let { field } = this.props;
    if (field.field instanceof forms.BooleanField) {
      return (
        <div className={this.props.className + " form-field " + field.status()}>
           <label>{field.render()} {field.label}</label>
        </div>
      );
    } else if (field.field instanceof forms.ChoiceField) {
      return (
        <div className={this.props.className + " form-field " + field.status()}>
          <label>{field.label}</label><br/>
          {field.render()}
        </div>
      );
    } else {
      return (
        <div className={this.props.className + " form-field " + field.status()}>
          {field.render({attrs: {placeholder: field.label}})}
        </div>
      );
    }
  }
}
