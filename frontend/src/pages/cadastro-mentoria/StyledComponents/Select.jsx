import { func, array } from 'prop-types';
import React from 'react';

import SelectStyled from './SelectStyled';

const Select = ({ options, select, onChange }) => (
  <SelectStyled onChange={onChange}>
    {/* eslint-disable-next-line max-len */}
    {options.map((value) => ((value === select) ? <option value={value} selected>{value}</option> : <option value={value}>{value}</option>))}
  </SelectStyled>
);

Select.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  options: array,
  onChange: func,
};

Select.defaultProps = {
  options: array,
  onChange: () => {},
};

export default Select;
