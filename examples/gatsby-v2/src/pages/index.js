import React from 'react'
import addToMailchimp from 'gatsby-plugin-mailchimp';


export default class IndexPage extends React.Component {
  state = {
    name: null,
    email: null,
  }

  _handleChange = e => {
    console.log({
      [`${e.target.name}`]: e.target.value,
    })
    this.setState({
      [`${e.target.name}`]: e.target.value,
    })
  }

  _handleSubmit = e => {
    e.preventDefault();
    console.log('submit', this.state)
    addToMailchimp(this.state.email, {name: this.state.name})
    .then(({msg, result}) => {
      console.log('msg', `${result}: ${msg}`);
      if (result !== 'success') {
        throw msg;
      }
      alert(msg);
    })
    .catch(err => {
      console.log('err', err);
      alert(err);
    });
  }

  render() {
    return (
      <div>
        <h1>Hi people</h1>
        <p>Submit the form below and check your browser console!</p>
        <div>
          <form onSubmit={this._handleSubmit}>
            <input type="text" onChange={this._handleChange} placeholder="name" name="name" />
            <input type="email" onChange={this._handleChange} placeholder="email" name="email" />
            <input type="submit" />
          </form>
        </div>
      </div>
    )
  }
}
