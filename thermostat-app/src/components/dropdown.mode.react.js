import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default class MyDropdownMode extends React.Component {
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

  render() {
    return (
			<ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret size="lg">
          Choix du mode
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={this.props.onForcedMode}>Forcé</DropdownItem>
          <DropdownItem onClick={this.props.onAutoMode}>Auto</DropdownItem>
          <DropdownItem onClick={this.props.onOffMode}>Arrêt</DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}
