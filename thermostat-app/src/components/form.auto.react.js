import React from 'react';
import { Form, Row, Col, FormGroup, Label, Input, CustomInput, Button } from 'reactstrap';
import MyRange from '../components/range.react';

export default class MyFormAuto extends React.Component {



  getRange = (range) => {
    return (
      <MyRange
        range={range}
        onRemove={this.props.onRemoveRange} />
    );
  }



  render() {

    console.log(this.props.ranges);

    const ranges = this.props.ranges.map(this.getRange);

    return (
      <Row>
      <Form>
        <FormGroup>
          <Label for="slider">Température hors plages : {this.props.normal}°</Label>
          <CustomInput type="range" id="slider" name="customRange" min={[0]} max={[50]} value={[this.props.normal]} onChange={this.props.onChange} />

          <Button size="lg" onClick={this.props.onAddRange}>Ajouter une plage</Button>

        </FormGroup>
      </Form>
      <Row>

{ranges}

      </Row>

      </Row>
    );
  }
}
