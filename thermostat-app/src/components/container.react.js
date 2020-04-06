import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import MyMedia from '../components/media.react';
import MyDropdownMode from '../components/dropdown.mode.react';
import MyContainerConfig from '../components/container.config.react';
import axios from "axios";
import io from "socket.io-client";

const config = require('../config');

const socket = io('ws://' + config.server.host + ':' + config.server.port);

export default class MyContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'auto', // Mode : forced, auto, off
      forced: 30, // Température en mode forced
      normal: 20, // Température hors plages en mode auto
      ranges: [], // Plages
      id: 0 // Identifiant d'une plage
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

  onAddRange = () => {

    const id = this.state.id;

    this.setState({
      id: id+1,
      ranges: [...this.state.ranges,
        {
          id: id,
          value: 20,
          start: '18:00',
          end: '20:00',
          days: [true, true, true, true, true, false, false]
        }
      ]
    });
  }

  onRemoveRange = (id) => {

    console.log(id);

    const ranges = this.state.ranges.filter(range => range.id != id);

    this.setState({
      ranges: ranges
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
            <MyMedia mode={this.state.mode} />
          </Col>
          <Col xs="5">
            <MyDropdownMode
              onForcedMode={this.onForcedMode}
              onAutoMode={this.onAutoMode}
              onOffMode={this.onOffMode} />
            <Button size="lg" onClick={this.onSubmit}>Envoyer</Button>
          </Col>
        </Row>
        <Row>
          <Col xs="6">
            <MyContainerConfig
              mode={this.state.mode}
              forced={this.state.forced}
              normal={this.state.normal}
              ranges={this.state.ranges}
              onForcedChange={this.onForcedChange}
              onNormalChange={this.onNormalChange}
              onAddRange={this.onAddRange}
              onRemoveRange={this.onRemoveRange}
              onSubmit={this.onSubmit} />
          </Col>
          <Col xs="6">

          </Col>
        </Row>
      </Container>
    );
  }
}
