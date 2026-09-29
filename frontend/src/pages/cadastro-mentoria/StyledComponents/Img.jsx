import { func } from 'prop-types';
import React from 'react';

const Img = ({ imgSrc, alt, onClick }) => (
  <div onClick={onClick}>
    <img src={imgSrc} alt={alt} />
  </div>
);

Img.propTypes = {
  onClick: func,
};

Img.defaultProps = {
  onClick: () => {},
};

export default Img;
