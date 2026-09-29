import React from 'react';
import { object, func, bool } from 'prop-types';
import Container from './StyledComponents';
import visible from '../../assets/visibility-button.png';
import remove from '../../assets/rubbish-bin-delete-button.png';
import edition from '../../assets/create-new-pencil-button.png';
import notVisible from '../../assets/invisible-button.png';
//  import RedeTimeSlot from '../RedeTimeSlot/RedeTimeSlot';
import { urlFiles } from '../../services/http';
import RedeButton from '../RedeButton/RedeButton';
import RedeIcon from '../RedeIcon/RedeIcon';
import CardDescription from './StyledComponents/card-description';
import CardHeader from './StyledComponents/card-header';
import CardLogo from './StyledComponents/card-logo';
import CardFooter from './StyledComponents/card-footer';
import CardContent from './StyledComponents/card-content';
import IconsWrapper from './StyledComponents/icons-wrapper';
import TimeSlotWrapper from './StyledComponents/timeslot-wrapper';
import MentorName from './StyledComponents/mentor-name';
import MentorImage from './StyledComponents/mentor-image';
import MentorContent from './StyledComponents/mentor-content';
//  import RedeMarcarMentoria from '../RedeMarcarMentoria/RedeMarcarMentoria';

const Card = ({
  mentoria,
  mentorias,
  onClickSchedule,
  onClickVisible,
  onClickRemove,
  onClickEdit,
  todosHorarios,
  isVisible,
}) => {
  const nextAvailableHours = mentoria.dateTime.slice(0, 3)
    .map((day) => <RedeButton claro descricao={`${day.day.slice(0, 3)} - ${day.times[0].hour}`} onClick={onClickSchedule} />);

  return (
    <Container>
      <CardLogo src={`${urlFiles}/${mentoria.image}`} />
      <CardContent>
        <CardHeader>
          <CardHeader.Title>
            {mentoria.title}
          </CardHeader.Title>
          { !todosHorarios && <RedeButton claro descricao="TODOS HORÁRIOS" onClick={onClickSchedule} /> }
        </CardHeader>
        <CardDescription>
          {mentoria.description}
        </CardDescription>
        <CardFooter>
          <CardFooter.SubTitle>
            Próximos horários
          </CardFooter.SubTitle>
          <CardFooter.Content>
            <TimeSlotWrapper>
              {nextAvailableHours}
            </TimeSlotWrapper>
            <IconsWrapper>
              { !mentorias && <RedeButton claro descricao="TODOS HORÁRIOS" onClick={onClickSchedule} /> }
              {
                !mentorias && (
                  <>
                    <RedeIcon imageUrl={remove} onClick={onClickRemove} />
                    <RedeIcon
                      imageUrl={isVisible ? visible : notVisible}
                      onClick={onClickVisible}
                    />
                    <RedeIcon imageUrl={edition} onClick={onClickEdit} />
                  </>
                )
              }
              {
                mentorias && (
                  <MentorContent>
                    <MentorName>{mentoria.mentorInfos.name.split(/(\s).+\s/).join('')}</MentorName>
                    <MentorImage src={`${urlFiles}/${mentoria.mentorInfos.image}`} />
                  </MentorContent>
                )
              }
            </IconsWrapper>
          </CardFooter.Content>
        </CardFooter>
      </CardContent>
    </Container>
  );
};

Card.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  mentoria: object,
  mentorias: bool,
  onClickSchedule: func,
  onClickVisible: func,
  onClickRemove: func,
  onClickEdit: func,
};

Card.defaultProps = {
  mentoria: null,
  mentorias: false,
  onClickSchedule: null,
  onClickVisible: null,
  onClickRemove: null,
  onClickEdit: null,
};

export default Card;
