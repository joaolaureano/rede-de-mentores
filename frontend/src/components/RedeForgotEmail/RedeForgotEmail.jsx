import React, { useRef, useEffect } from 'react';
import { string, func, bool } from 'prop-types';
import { Dialog } from '@material-ui/core';
import './RedeForgotEmail.css';
import plus from '../../assets/plus.png';
import RedeButton from '../RedeButton/RedeButton';
import RedeTextField from '../RedeTextField/RedeTextField';

const RedeForgotEmail = ({
  email, onChangeEmail, onConfirm, opened, onClose,
  // descricao, onClick, desabilitado, cancelar, claro, loading,
}) => {
  const confirm = () => {
    onClose();
    onConfirm({
      email,
    });
  };

  const keyPress = (evt) => {
    if (opened && evt.key === 'Enter') {
      confirm();
    }
  };

  return (
    <Dialog open={opened} onClose={onClose} className="rede-forgot-email" onKeyPress={keyPress}>
      <div className="content">
        <button type="button" className="close-icon" onClick={onClose}>
          <img src={plus} alt="fechar" />
        </button>
        <div className="titulo">
          REDEFINIÇÃO DE SENHA
        </div>
        <div className="centro">
          <RedeTextField
            valor={email}
            onChange={onChangeEmail}
            descricao="Email"
          />
        </div>
        <div className="botao">
          <RedeButton
            descricao="REDEFINIR SENHA"
            onClick={confirm}
            desabilitado={!email}
          />
        </div>
      </div>
    </Dialog>
  );
};

RedeForgotEmail.propTypes = {
  opened: bool.isRequired,
  onClose: func.isRequired,
  onChangeEmail: func.isRequired,
  email: string,
  onConfirm: func,
};

RedeForgotEmail.defaultProps = {
  email: '',
  onConfirm: () => { },
};

export default RedeForgotEmail;

// <Button
//   onClick={onClick}
//   disabled={desabilitado || loading}
//   cancelar={cancelar}
//   claro={claro}
//   loading={loading}
// >
//   {loading && (
//   <>
//     <RefreshIcon />
//   </>
//   )}
//   {descricao}
// </Button>
