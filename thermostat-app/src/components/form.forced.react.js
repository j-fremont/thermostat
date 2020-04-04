import React from 'react';
import { Form, FormGroup, Label, CustomInput } from 'reactstrap';

export default class MyFormForced extends React.Component {
  render() {
    return (
      <Form>
        <FormGroup>
          <Label for="slider">Température de marche forcée : {this.props.forced}°</Label>
          <CustomInput type="range" id="slider" name="customRange" min={[0]} max={[50]} value={[this.props.forced]} onChange={this.props.onChange} />
        </FormGroup>
      </Form>
    );
  }
}
