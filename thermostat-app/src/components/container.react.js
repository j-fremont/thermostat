import React from 'react';
import { Container, Row, Col, Button, FormGroup, ButtonGroup } from 'reactstrap';
import MyMedia from '../components/media.react';
import MyAlert from '../components/alert.react';
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
      forced: undefined, // Température en mode forced
      normal: undefined, // Température hors plages en mode auto
      slots: [], // Plages
      id: 0, // Identifiant d'une plage
			repeat: 0, // Répétitions d'une plage de 5 minutes en marche forcée
			alert: undefined
    };
  }

  componentDidMount() {
    axios.get("http://" + config.server.host + ":" + config.server.port + "/state").then((response) => {
			console.log(response.data);
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

  onAddSlot = () => {

		if (this.state.slots.length < 4) {

		  const id = this.state.id;

		  this.setState({
		    id: id+1,
		    slots: [...this.state.slots,
		      {
		        id: id,
		        value: 20,
		        start: '18:00',
		        end: '20:00',
						//utc: true,
		        days: [false, true, true, true, true, true, false]
		      }
		    ]
		  });
		}
  }

  onRemoveSlot = (id) => {

    const slots = this.state.slots.filter(slot => slot.id !== id);

    this.setState({
      slots: slots
    });
  }

  onChangeTemperature = (id, value) => {

		var slots = this.state.slots;

		slots.filter(slot => slot.id === id)[0].value = value;

		this.setState({
      slots: slots
    });
  }

  onChangeStart = (id, value) => {

		var slots = this.state.slots;

		slots.filter(slot => slot.id === id)[0].start = value;

		this.setState({
      slots: slots
    });
  }

  onChangeEnd = (id, value) => {

		var slots = this.state.slots;

		slots.filter(slot => slot.id === id)[0].end = value;

		this.setState({
      slots: slots
    });
  }

  /*onToggleUtc = (id) => {

		var slots = this.state.slots;

		var slot = slots.filter(slot => slot.id === id)[0];

		slot.utc = !slot.utc;

		this.setState({
      slots: slots
    });
  }*/

  onToggleDay = (id, day) => {

		var slots = this.state.slots;

		var slot = slots.filter(slot => slot.id === id)[0];

		slot.days[day] = !slot.days[day];

		this.setState({
      slots: slots
    });
  }

	onRepeatChange = (value) => {
    this.setState({
      repeat: value
    });
	}

  onSubmit = () => {
    socket.emit('sock_thermostat', this.state);
		this.setState({
      alert: {
				color: 'primary',
				message: 'Message envoyé !'
			}
    });
  }

	getAlert = () => {
		if (this.state.alert!==undefined) {
			return (
				<MyAlert color={this.state.alert.color} message={this.state.alert.message} resetAlert={this.resetAlert}/>
			)
		}
	}

	resetAlert = () => {
		this.setState({
      alert: undefined
    });
	}

  render() {

		let alert = this.getAlert();

    return (
      <Container fluid={true}>
        <Row>
          <Col xs="4">
            <MyMedia mode={this.state.mode} />
          </Col>
          <Col xs="4">
  					<FormGroup>
    					<ButtonGroup>
								<MyDropdownMode
              		onForcedMode={this.onForcedMode}
              		onAutoMode={this.onAutoMode}
              		onOffMode={this.onOffMode} />
            		<Button size="lg" onClick={this.onSubmit}>Envoyer</Button>
    					</ButtonGroup>
  					</FormGroup>
          </Col>
          <Col xs="4">
						{alert}
          </Col>
        </Row>
        <Row>
          <Col>
            <MyContainerConfig
              mode={this.state.mode}
              forced={this.state.forced}
              normal={this.state.normal}
              slots={this.state.slots}
							repeat={this.state.repeat}
              onForcedChange={this.onForcedChange}
              onNormalChange={this.onNormalChange}
              onAddSlot={this.onAddSlot}
             	onRemoveSlot={this.onRemoveSlot}
							onChangeTemperature={this.onChangeTemperature}
							onChangeStart={this.onChangeStart}
							onChangeEnd={this.onChangeEnd}
							//onToggleUtc={this.onToggleUtc}
							onToggleDay={this.onToggleDay}
							onRepeatChange={this.onRepeatChange}
              onSubmit={this.onSubmit} />
          </Col>
        </Row>
      </Container>
    );
  }
}
