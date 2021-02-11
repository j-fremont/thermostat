import React from 'react';
import { Form, Row, Col, FormGroup, Label, CustomInput, Button } from 'reactstrap';
import MySlot from '../components/slot.react';

export default class MyFormAuto extends React.Component {

	getSlot = (slot) => {
		return (
			<MySlot
				slot={slot}
				onRemove={this.props.onRemoveSlot}
				onChangeTemperature={this.props.onChangeTemperature}
				onChangeStart={this.props.onChangeStart}
				onChangeEnd={this.props.onChangeEnd}
				//onToggleUtc={this.props.onToggleUtc}
				onToggleDay={this.props.onToggleDay} />
		);
	}

	render() {

		const slots = this.props.slots.map(this.getSlot);

		return (
			<Col>
				<Row>
					<Col xs="3">
					<Form>
						<FormGroup>
							<Label for="slider">Température hors plages : {this.props.normal}°</Label>
							<CustomInput type="range" id="slider" name="customRange" min={[0]} max={[50]} value={[this.props.normal]} onChange={this.props.onChange} />
						</FormGroup>
						<Button size="lg" onClick={this.props.onAddSlot}>Ajouter une plage</Button>
					</Form>
					</Col>
				</Row>
				<Row>
					{slots}
				</Row>
			</Col>
		);
	}
}
