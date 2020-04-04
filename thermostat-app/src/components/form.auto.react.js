import React from 'react';
import { Form, Row, Col, FormGroup, Label, Input, CustomInput } from 'reactstrap';

export default class MyFormAuto extends React.Component {
  render() {
    return (
      <Form>
        <FormGroup>
          <Label for="slider">Température hors plages : {this.props.normal}°</Label>
          <CustomInput type="range" id="slider" name="customRange" min={[0]} max={[50]} value={[this.props.normal]} onChange={this.props.onChange} />
        </FormGroup>
      </Form>
    );
  }
}

/*
<FormGroup row>
  <Label sm={12}>Plage 1</Label>
  <Label for="slider" sm={4}>Température : {this.props.normal}°</Label>
  <Col sm={8}>
    <CustomInput type="range" id="slider" name="customRange" min={[0]} max={[50]} value={[this.props.normal]} onChange={this.props.onChange} />
  </Col>
  <Label for="slider" sm={5}>Jours : </Label>
  <Col sm={1}>
    <Label check>
      <Input type="checkbox" id="checkbox2" />{'Lu'}
    </Label>
  </Col>
  <Col sm={1}>
    <Label check>
      <Input type="checkbox" id="checkbox2" />{'Ma'}
    </Label>
  </Col>
  <Col sm={1}>
    <Label check>
      <Input type="checkbox" id="checkbox2" />{'Me'}
    </Label>
  </Col>
  <Col sm={1}>
    <Label check>
      <Input type="checkbox" id="checkbox2" />{'Je'}
    </Label>
  </Col>
  <Col sm={1}>
    <Label check>
      <Input type="checkbox" id="checkbox2" />{'Ve'}
    </Label>
  </Col>
  <Col sm={1}>
    <Label check>
      <Input type="checkbox" id="checkbox2" />{'Sa'}
    </Label>
  </Col>
  <Col sm={1}>
    <Label check>
      <Input type="checkbox" id="checkbox2" />{'Di'}
    </Label>
  </Col>
</FormGroup>
*/
