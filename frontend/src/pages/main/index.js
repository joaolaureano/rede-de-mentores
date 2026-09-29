import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: sessionStorage.getItem('token'),
    };
  }

  render() {
    const { token } = this.state;
    return (
      <div>
        <h1>Bem vindo a Rede de Mentores</h1>
        <p>
          sua chave de acesso:
          {token}
        </p>
      </div>
    );
  }
}

export default withRouter(Main);
