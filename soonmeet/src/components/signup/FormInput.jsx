import React from 'react';


class FormInput extends React.Component {
  state = { value: '' };

  /**
   * Function capitalizing first letter of object that can be converted to string.
   * @param sentence
   * @returns {string} capitalized string
   */
  capitalizeSentence = sentence => {
    sentence = sentence.toString();
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
    return sentence;
  };

  /**
   * Function returning jsx used for indicating errors.
   * @param errorMessage
   * @returns jsx
   */
  renderError(errorMessage) {
    return <small className="text-danger" >{this.capitalizeSentence(errorMessage)}</small>
  }

  /**
   * Check if error occurred.
   * @returns {boolean}
   */
  errorOccurred() {
    return this.props.errorMessage !== undefined;
  }

  render() {
    return (
      <div className="form-group">
        <input className={`form-control ${this.errorOccurred() ? 'border-danger' : ''}`}
               value={this.state.value}
               onChange={e => this.setState({ value: e.target.value })}
               type={this.props.type}
               name={this.props.name}
               placeholder={this.props.placeholder}
               required={this.props.required}
               autoFocus={this.props.autoFocus}
               id={this.props.id}
        />
        {this.errorOccurred() ? this.renderError(this.props.errorMessage) : '' }
      </div>
    );
  }
}

export default FormInput;