import React from 'react';
import { Form, Row, Col, FormGroup, Label, Input, CustomInput, Button } from 'reactstrap';

export default class MyRange extends React.Component {

  handleRemove = () => {
    var onRemove = this.props.onRemove;
    if (onRemove) {
      onRemove(this.props.range.id);
    }
  }

  handleChangeTemperature = (event) => {
    var onChange = this.props.onChangeTemperature;
    if (onChange) {
      onChange(this.props.range.id, event.target.value);
    }
  }

  handleChangeStart = (event) => {
    var onChange = this.props.onChangeStart;
    if (onChange) {
      onChange(this.props.range.id, event.target.value);
    }
	}

  handleChangeEnd = (event) => {
    var onChange = this.props.onChangeEnd;
    if (onChange) {
      onChange(this.props.range.id, event.target.value);
    }
	}

	toggleMonday = () => {
    var onToggle = this.props.onToggleDay;
    if (onToggle) {
      onToggle(this.props.range.id, 0);
    }
  }

	toggleTuesday = () => {
    var onToggle = this.props.onToggleDay;
    if (onToggle) {
      onToggle(this.props.range.id, 1);
    }
  }

	toggleWednesday = () => {
    var onToggle = this.props.onToggleDay;
    if (onToggle) {
      onToggle(this.props.range.id, 2);
    }
  }

	toggleThursday = () => {
    var onToggle = this.props.onToggleDay;
    if (onToggle) {
      onToggle(this.props.range.id, 3);
    }
  }

	toggleFriday = () => {
    var onToggle = this.props.onToggleDay;
    if (onToggle) {
      onToggle(this.props.range.id, 4);
    }
  }

	toggleSaturday = () => {
    var onToggle = this.props.onToggleDay;
    if (onToggle) {
      onToggle(this.props.range.id, 5);
    }
  }

	toggleSunday = () => {
    var onToggle = this.props.onToggleDay;
    if (onToggle) {
      onToggle(this.props.range.id, 6);
    }
  }

	render() {
    return (
			<Col xs="3">
		    <Form>
		      <FormGroup>
		        <Label for="sliderTemperature">Température : {this.props.range.value}°</Label>
  		      <CustomInput type="range" name="temperature" id="sliderTemperature" min={[0]} max={[50]} value={[this.props.range.value]} onChange={this.handleChangeTemperature} />
      		</FormGroup>
				  <Row form>
				    <Col md={6}>
				      <FormGroup>
				        <Label for="startTime">Début</Label>
				        <Input type="time" name="startTime" id="startTime" placeholder="time placeholder" value={this.props.range.start} onChange={this.handleChangeStart} />
				      </FormGroup>
				    </Col>
				    <Col md={6}>
				      <FormGroup>
				        <Label for="endTime">Fin</Label>
				        <Input type="time" name="endTime" id="endTime" placeholder="time placeholder" value={this.props.range.end} onChange={this.handleChangeEnd} />
				      </FormGroup>
				    </Col>
					</Row>
				  <Row form>
				    <Col md={3}>
				      <FormGroup>
				        <Label for="startTime">Jours</Label>
				      </FormGroup>
				    </Col>
				    <Col md={'auto'}>
				      <FormGroup tag="fieldset">
						    <FormGroup check>
								  <Label check>
								    <Input type="checkbox" id="checkboxMonday" checked={this.props.range.days[0]} onChange={this.toggleMonday} />{'Lundi'}
								  </Label>
						    </FormGroup>
						    <FormGroup check>
								  <Label check>
								    <Input type="checkbox" id="checkboxTuesday" checked={this.props.range.days[1]} onChange={this.toggleTuesday} />{'Mardi'}
								  </Label>
						    </FormGroup>
						    <FormGroup check>
								  <Label check>
								    <Input type="checkbox" id="checkboxWednesday" checked={this.props.range.days[2]} onChange={this.toggleWednesday} />{'Mercredi'}
								  </Label>
						    </FormGroup>
						    <FormGroup check>
								  <Label check>
								    <Input type="checkbox" id="checkboxThursday" checked={this.props.range.days[3]} onChange={this.toggleThursday} />{'Jeudi'}
								  </Label>
						    </FormGroup>
						    <FormGroup check>
								  <Label check>
								    <Input type="checkbox" id="checkboxFriday" checked={this.props.range.days[4]} onChange={this.toggleFriday} />{'Vendredi'}
								  </Label>
						    </FormGroup>
						    <FormGroup check>
								  <Label check>
								    <Input type="checkbox" id="checkboxSa" checked={this.props.range.days[5]} onChange={this.toggleSaturday} />{'Samedi'}
								  </Label>
						    </FormGroup>
						    <FormGroup check>
								  <Label check>
								    <Input type="checkbox" id="checkboxDi" checked={this.props.range.days[6]} onChange={this.toggleSunday} />{'Dimanche'}
								  </Label>
						    </FormGroup>
				      </FormGroup>
				    </Col>
					</Row>
				  <Button size="lg" onClick={this.handleRemove}>Supprimer</Button>
				</Form>
			</Col>
    );
  }
}
