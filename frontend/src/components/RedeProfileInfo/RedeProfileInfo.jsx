import React from 'react';
import { string, func } from 'prop-types';
import Icon from '../RedeIcon/RedeIcon';
import Container from './StyledComponents';
import linkedinIcon from '../../assets/linkedin.png';
import Information from './StyledComponents/information';
import edition from '../../assets/create-new-pencil-button.png';

const ProfileUser = ({
  name, linkedin, image, editFunction,
}) => (
  <Container>
    <Container.Logo src={image} />
    <Container.UserInformations>
      <Container.UserName>{name}</Container.UserName>
      <Information>
        <Information.Icon imageUrl={linkedinIcon} />
        <Information.Name>{linkedin}</Information.Name>
      </Information>
      <Container.Bottom>
        <Icon imageUrl={edition} onClick={editFunction} />
      </Container.Bottom>
    </Container.UserInformations>
  </Container>
);

ProfileUser.propTypes = {
  name: string,
  linkedin: string,
  image: string,
  editFunction: func,
};

ProfileUser.defaultProps = {
  name: '',
  linkedin: '',
  image: '',
  editFunction: () => {},
};

export default ProfileUser;
