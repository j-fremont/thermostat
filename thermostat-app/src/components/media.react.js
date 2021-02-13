import React from 'react';
import { Media } from 'reactstrap';
import Logo from '../thermostat.png';

const style = {
  'width': '128px',
  'margin-right': '25px'
};

export default class MyMedia extends React.Component {

  getMode = () => {
    switch (this.props.mode) {
      case 'forced':
        return "Thermostat en marche forcée";
      case 'auto':
        return "Thermostat en marche automatique";
      case 'off':
        return "Thermostat en arrêt";
      default:
        return "Mode inconnu";
    }
  }

  render() {
    const mode = this.getMode();
    return (
      <Media>
        <Media left href="#">
          <Media style={style} object src={Logo} alt="Logo" />
        </Media>
        <Media body>
          <Media heading>
            Thermostat
          </Media>
          {mode}
        </Media>
      </Media>
    );
  }
};
