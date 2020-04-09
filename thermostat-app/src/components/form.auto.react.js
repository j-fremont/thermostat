import React from 'react';
import { Form, Row, Col, FormGroup, Label, CustomInput, Button } from 'reactstrap';
import MyRange from '../components/range.react';

export default class MyFormAuto extends React.Component {

  getRange = (range) => {
    return (
      <MyRange
        range={range}
				onRemove={this.props.onRemoveRange}
				onChangeTemperature={this.props.onChangeTemperature}
				onChangeStart={this.props.onChangeStart}
				onChangeEnd={this.props.onChangeEnd}
				onToggleDay={this.props.onToggleDay} />
    );
  }

  render() {

    const ranges = this.props.ranges.map(this.getRange);

    return (
      <Col>
				<Row>
					<Col xs="3">
      		<Form>
        		<FormGroup>
        	  	<Label for="slider">Température hors plages : {this.props.normal}°</Label>
        	  	<CustomInput type="range" id="slider" name="customRange" min={[0]} max={[50]} value={[this.props.normal]} onChange={this.props.onChange} />
        		</FormGroup>
						<Button size="lg" onClick={this.props.onAddRange}>Ajouter une plage</Button>
      		</Form>
					</Col>
      	</Row>
				<Row>
					{ranges}
      	</Row>
      </Col>
    );
  }
}
