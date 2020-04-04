import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import MyMedia from '../components/media.react';
import MyContainerConfig from '../components/container.config.react';
import axios from "axios";
import io from "socket.io-client";

const config = require('../config');

const socket = io('ws://' + config.server.host + ':' + config.server.port);

export default class MyContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'auto', // forced, auto, off
      forced: 30,
      normal: 20,
      ranges: []
    };
  }

  componentDidMount() {
    axios.get("http://" + config.server.host + ":" + config.server.port + "/state").then((response) => {
      this.setState(response.data);
    });
  }

  onForcedMode = () => {
    this.setState({
      mode: 'forced'
    });
  }

  onAutoMode = () => {
    this.setState({
      mode: 'auto'
    });
  }

  onOffMode = () => {
    this.setState({
      mode: 'off'
    });
  }

  onForcedChange = (event) => {
    this.setState({
      forced: event.target.value
    });
  }

  onNormalChange = (event) => {
    this.setState({
      normal: event.target.value
    });
  }

  onSubmit = () => {
    socket.emit('sock_thermostat', this.state);
  }

  render() {
    return (
      <Container fluid={true}>
        <Row>
          <Col xs="5">
            <MyMedia mode={this.state.mode}/>
          </Col>
          <Col xs="5">
            <Button size="lg" onClick={this.onSubmit}>Envoyer</Button>
          </Col>
        </Row>
        <Row>
          <Col xs="6">
            <MyContainerConfig
              onForcedMode={this.onForcedMode}
              onAutoMode={this.onAutoMode}
              onOffMode={this.onOffMode}
              onForcedChange={this.onForcedChange}
              onNormalChange={this.onNormalChange}
              onSubmit={this.onSubmit}
              mode={this.state.mode}
              forced={this.state.forced}
              normal={this.state.normal}/>
          </Col>
          <Col xs="6">

          </Col>
        </Row>
      </Container>
    );
  }
}
