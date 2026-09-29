import React from 'react';
import { string, func } from 'prop-types';
import Icon from './StyledComponents';

const RedeIcon = ({ imageUrl, onClick }) => <Icon src={imageUrl} onClick={onClick} />;

RedeIcon.propTypes = {
  imageUrl: string,
  onClick: func,
};

RedeIcon.defaultProps = {
  imageUrl: '',
  onClick: () => {},
};

export default RedeIcon;
