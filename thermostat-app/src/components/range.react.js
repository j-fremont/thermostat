import React from 'react';
import { Form, Row, Col, FormGroup, Label, Input, CustomInput, Button } from 'reactstrap';

export default class MyRange extends React.Component {

  handleRemove = () => {
    var onRemove = this.props.onRemove;
    if (onRemove) {
      onRemove(this.props.range.id);
    }
  }

  render() {
    return (
      <FormGroup row>
        <Label sm={12}>Plage 1</Label>
        <Label for="slider" sm={4}>Température : {this.props.range.value}°</Label>
        <Col sm={8}>
          <CustomInput type="range" id="slider" name="customRange" min={[0]} max={[50]} value={[this.props.range.value]} onChange={this.props.range.onChange} />
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

        <Button size="lg" onClick={this.handleRemove}>Supprimer</Button>
      </FormGroup>
    );
  }
}
