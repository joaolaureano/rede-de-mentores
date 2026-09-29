import React from 'react';
import {
  string, func, arrayOf, any, bool,
} from 'prop-types';
import TextField from '../RedeFormLabel/StyledComponents';
import Container from './StyledComponents';
import Select from './StyledComponents/Select';


const RedeSelect = ({
  options,
  selected,
  onChange,
  erro,
  msgAjuda,
}) => (
  <Container erro={erro}>
    <TextField.Label>Áreas de Conhecimento</TextField.Label>
    <Select onChange={onChange}>
      <option value="" disabled selected={(!selected)}>Selecione...</option>
      {
        options.map((element) => ((selected === element)
          ? <option value={element} selected>{element}</option>
          : <option value={element} disabled={((element === ''))}>{element}</option>))
      }
    </Select>
    <Container.MsgAjuda>{msgAjuda}</Container.MsgAjuda>
  </Container>
);

RedeSelect.propTypes = {
  options: arrayOf(any),
  selected: string,
  onChange: func,
  erro: bool,
  msgAjuda: string,
};

RedeSelect.defaultProps = {
  options: [],
  selected: '',
  onChange: () => { },
  erro: false,
  msgAjuda: '',
};

export default RedeSelect;
