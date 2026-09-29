import React from 'react';
import { string, func, bool } from 'prop-types';
import HorarioButton from './StyledComponents';

const RedeHorarioButton = ({
  horario, onClick, ocupado, desabilitado,
}) => {
  const click = () => {
    if (!ocupado && !desabilitado && typeof onClick === 'function') {
      onClick();
    }
  };

  return (
    <HorarioButton
      onClick={click}
      ocupado={ocupado}
      disabled={desabilitado}
    >
      {horario}
    </HorarioButton>
  );
};

RedeHorarioButton.propTypes = {
  horario: string,
  onClick: func,
  desabilitado: bool,
  ocupado: bool,
};

RedeHorarioButton.defaultProps = {
  horario: '',
  onClick: () => { },
  desabilitado: false,
  ocupado: false,
};

export default RedeHorarioButton;
