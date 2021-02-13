import React from 'react';
import { Alert } from 'reactstrap';

export default class MyAlert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true
    };
  }

  onDismissAlert = () => {
    this.setState({
      open: !this.state.open
    });
    this.props.resetAlert();
  }

  render() {
    return (
      <Alert color={this.props.color} isOpen={this.state.open} toggle={this.onDismissAlert}>
        {this.props.message}
      </Alert>
    );
  }
}
