import React from 'react';
import { Link } from 'react-router-dom';
import { string, func, bool } from 'prop-types';
import Container from './StyledComponents';
import CardDescription from './StyledComponents/card-description';
import CardHeader from './StyledComponents/card-header';
import CardLogo from './StyledComponents/card-logo';
import CardFooter from './StyledComponents/card-footer';
import CardContent from './StyledComponents/card-content';
import IconsWrapper from './StyledComponents/icons-wrapper';
import MentorName from './StyledComponents/mentor-name';
import MentorImage from './StyledComponents/mentor-image';
import MentorContent from './StyledComponents/mentor-content';

const Card = ({
  title,
  description,
  image,
  mentorName,
  mentorImage,
}) => {
  const adjustSizeDescription = () => ((description.length >= 114) ? `${description.substr(0, 111)}...` : description);

  return (
    <Container>
      <CardLogo src={image} />
      <CardContent>
        <CardHeader>
          <CardHeader.Title>
            {title}
          </CardHeader.Title>
          <Link to="/mentoria">
            <CardHeader.Button descricao="TODOS HORÁRIOS" />
          </Link>
        </CardHeader>
        <CardDescription>
          {adjustSizeDescription(description)}
        </CardDescription>
        <CardFooter>
          <CardFooter.Content>
            <IconsWrapper>
              <Link to="/mentoria">
                <CardHeader.Button descricao="TODOS HORÁRIOS" />
              </Link>
              <MentorContent>
                <MentorImage src={mentorImage} />
                <MentorName>{mentorName.split(' ').shift()}</MentorName>
              </MentorContent>
            </IconsWrapper>
          </CardFooter.Content>
        </CardFooter>
      </CardContent>
    </Container>
  );
};

Card.propTypes = {
  description: string,
  title: string,
  mentorName: string,
};

Card.defaultProps = {
  description: '',
  title: '',
  mentorName: '',
};

export default Card;
