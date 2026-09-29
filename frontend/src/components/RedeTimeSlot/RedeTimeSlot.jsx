import React from 'react';
import { string, func, bool } from 'prop-types';
import TimeSlot from './StyledComponents'

const RedeTimeSlot = ({
  descricao, onClick, selecionado,deselecionado
}) => (
  <TimeSlot deselecionado={deselecionado} selecionado={selecionado}>
    {descricao}
  </TimeSlot>
);

RedeTimeSlot.propTypes = {
  descricao: string,
  selecionado: bool,
  deselecionado: bool,
  onChange: func,
};

RedeTimeSlot.defaultProps = {
  descricao: '',
  selecionado : true,
  deselecionado: false,
  onClick: () => {},
};

export default RedeTimeSlot;
