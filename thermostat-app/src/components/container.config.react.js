import React from 'react';
import { Container, Row, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import MyFormForced from '../components/form.forced.react';
import MyFormAuto from '../components/form.auto.react';
import MyFormOff from '../components/form.off.react';

export default class MyContainerConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  currentForm = () => {
    switch (this.props.mode) {
      case 'forced':
        return (<MyFormForced onChange={this.props.onForcedChange} forced={this.props.forced}/>);
      case 'auto':
        return (<MyFormAuto onChange={this.props.onNormalChange} normal={this.props.normal}/>);
      case 'off':
        return (<MyFormOff/>);
      default:
        return "Mode inconnu";
    }
  }

  render() {
    const form = this.currentForm();
    return (
      <Container fluid={true}>
        <Row>
          <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle caret size="lg">
              Choix mode
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={this.props.onForcedMode}>Forcé</DropdownItem>
              <DropdownItem onClick={this.props.onAutoMode}>Auto</DropdownItem>
              <DropdownItem onClick={this.props.onOffMode}>Arrêt</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </Row>
        <Row>
          {form}
        </Row>
      </Container>
    );
  }
}
