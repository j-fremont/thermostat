import React from 'react';
import { Form, FormGroup, Label, CustomInput, Input, InputGroup, InputGroupAddon } from 'reactstrap';

export default class MyFormForced extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			enabled: false
		};
	}

	toggle = () => {
		if (this.state.enabled) {
			this.props.onRepeatChange(0);
		}
		this.setState({
			enabled: !this.state.enabled
		});
	}

	onRepeatChange = (event) => {
		this.props.onRepeatChange(event.target.value);
	}

	repeat = () => {
		if (this.state.enabled) {
			return (
				<Input placeholder="0" min={0} max={48} type="number" step="1" value={this.props.repeat} onChange={this.onRepeatChange} />
			);
		} else {
			return (
				<Input placeholder="0" min={0} max={48} type="number" step="1" value={this.props.repeat} onChange={this.onRepeatChange} disabled/>
			);
		}
	}

	render() {

		const repeat = this.repeat();

		return (
			<Form>
				<FormGroup>
					<Label for="slider">Température de marche forcée : {this.props.forced}°</Label>
					<CustomInput type="range" id="slider" name="customRange" min={[0]} max={[50]} value={[this.props.forced]} onChange={this.props.onForcedChange} />
				</FormGroup>
				<FormGroup>
					<CustomInput type="switch" id="switchLimit" label="Limité dans le temps" value={this.state.enabled} onChange={this.toggle} />
				</FormGroup>
				<FormGroup>
					<InputGroup>
						{repeat}
				 		<InputGroupAddon addonType="append">fois 5 minutes</InputGroupAddon>
					</InputGroup>
				</FormGroup>
			</Form>
		);
	}
}
