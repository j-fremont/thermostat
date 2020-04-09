import React from 'react';
import { Row } from 'reactstrap';
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
        return (<MyFormForced
          forced={this.props.forced}
          onChange={this.props.onForcedChange} />);
      case 'auto':
        return (<MyFormAuto
          normal={this.props.normal}
          ranges={this.props.ranges}
          onChange={this.props.onNormalChange}
          onAddRange={this.props.onAddRange}
					onRemoveRange={this.props.onRemoveRange}
					onChangeTemperature={this.props.onChangeTemperature}
					onChangeStart={this.props.onChangeStart}
					onChangeEnd={this.props.onChangeEnd}
					onToggleDay={this.props.onToggleDay} />);
      case 'off':
        return (<MyFormOff/>);
      default:
        return "Mode inconnu";
    }
  }

  render() {
    const form = this.currentForm();
    return (
      <Row>
				{form}
      </Row>
    );
  }
}
