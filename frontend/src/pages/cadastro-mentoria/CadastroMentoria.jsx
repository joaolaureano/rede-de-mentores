import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Container from './StyledComponents';
import { cadastrarMentoria, atualizarMentoria } from '../../services/mentoria';
import RedeButton from '../../components/RedeButton/RedeButton';
import RedeTextArea from '../../components/RedeTextArea/RedeTextArea';
import RedeTextField from '../../components/RedeTextField/RedeTextField';
import RedeFormLabel from '../../components/RedeFormLabel/RedeFormLabel';
import RedeHorizontalSeparator from '../../components/RedeHorizontalSeparator/RedeHorizontalSeparator';
import plusButton from '../../assets/plus-circle.png';
import removeButton from '../../assets/remove-button.png';

import DivCheckbox from './StyledComponents/DivCheckbox';
import Checkbox from './StyledComponents/Checkbox';
import DivSelect from './StyledComponents/DivSelect';
import ContainerDataHora from './StyledComponents/ContainerDataHora';
import Select from './StyledComponents/Select';
import DivImage from './StyledComponents/DivImage';
import Espaco from './StyledComponents/Espaco';
import { profile } from '../../services/user';

import { urlFiles } from '../../services/http';


/**
 *
 * @returns {*}
 * @constructor
 */
function CadastroMentoria() {
  const oldMentoria = JSON.parse(sessionStorage.getItem('oldMentoria'));

  // const PageTitle = oldMentoria ? 'Atualização de Mentoria' : 'Nova Mentoria';
  const ActionButtonTitle = oldMentoria ? 'Atualizar Mentoria' : 'Criar Mentoria';
  const [title, setTitle] = useState(oldMentoria ? oldMentoria.data.title : '');
  const [description, setDescription] = useState(oldMentoria ? oldMentoria.data.description : '');
  const [knowledgeArea, setKnowledgeArea] = useState(oldMentoria ? oldMentoria.data.knowledgeArea : '');
  const [mentoringOption, setMentoringOption] = useState([]);
  const [image, setImage] = useState(oldMentoria ? oldMentoria.data.image : '');
  const [imageUrl, setImageUrl] = useState(oldMentoria ? `${urlFiles}/${oldMentoria.data.image}` : '');

  const [daysSelect] = useState(['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']);
  const [hoursSelect] = useState(['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00']);

  const [listDataHours, setListDataHours] = useState([]);
  const { enqueueSnackbar } = useSnackbar();


  const enqueue = (msg = '', variant = 'error', autoHideDuration = 2500) => {
    enqueueSnackbar(msg, { variant, autoHideDuration });
  };

  const history = useHistory();

  const setValueDate = (id, value) => {
    setListDataHours(
      listDataHours.map((element, index) => (
        (index === id) ? { date: value, hour: element.hour } : element)),
    );
  };

  const setValueHour = (id, value) => {
    setListDataHours(
      listDataHours.map((element, index) => (
        (index === id) ? { date: element.date, hour: value } : element)),
    );
  };


  const handleAddMentoria = (event) => {
    event.preventDefault();

    const token = sessionStorage.getItem('token');
    const data = new FormData();
    data.append('title', title);
    data.append('description', description);
    data.append('knowledgeArea', knowledgeArea);

    mentoringOption.forEach((element) => {
      if (element.checked) {
        data.append('mentoringOption', element.value);
      }
    });

    data.append('image', image);

    listDataHours.forEach((element) => {
      data.append('time', element.hour);
      data.append('dayOfWeek', element.date);
    });

    // || !data.get('mentoringOption')
    if (!data.get('title') || !data.get('description') || !data.get('knowledgeArea') || !data.get('time') || !data.get('dayOfWeek')) {
      enqueue('Preencha todos os campos.');
    } else if (!data.get('image')) {
      enqueue('Insira uma foto para mentoria');
    } else if (!data.get('mentoringOption')) {
      enqueue('Selecione o tipo de mentoria');
    } else if (oldMentoria) {
      if (
        typeof image === 'string' //! !
      ) data.delete('image');
      const headers = { headers: { param: { id: oldMentoria.id }, Authorization: `Bearer ${token}` } };
      atualizarMentoria(headers, data).then((res) => {
        if (res.status === 200) {
          enqueue('Mentoria atualiada com sucesso', 'success');
        }
        history.push('/mentor');
      }).catch((err) => {
        enqueue('Problema ao atualizar mentoria');
        console.error(err);
      });
    } else {
      const headers = { headers: { Authorization: `Bearer ${token}` } };
      cadastrarMentoria(headers, data).then((res) => {
        if (res.status === 200) {
          enqueue('Mentoria cadastrada com sucesso', 'success');
        }
        history.push('/mentor');
      }).catch((err) => {
        enqueue(err.response.data.error);
      });
    }
  };
  function handleImage() {
    let url = '';
    document.getElementById('fileButton').click();
    document.getElementById('fileButton').onchange = (event) => {
      const imageType = (event.target.files[0]) ? event.target.files[0].type : null;

      if (!['image/jpg', 'image/jpeg'].includes(imageType)) {
        return enqueue('A imagem precisa ser JPG/JPEG');
      }
      try {
        url = URL.createObjectURL(event.target.files[0]);
        setImageUrl(url);
        setImage(event.target.files[0]);
      } catch (e) {
        url = '';
      }
    };
  }

  const cleanForm = (event) => {
    event.preventDefault();
    setTitle('');
    setDescription('');
    setKnowledgeArea('');
    setMentoringOption('');
    setImage('');
    history.push('/mentor');
    sessionStorage.removeItem('oldMentoria');
  };

  const handleRemove = (id) => {
    setListDataHours(listDataHours.filter((element, index) => id !== index));
  };

  const handleAdd = (date, hour) => {
    const option = {
      date,
      hour,
    };
    setListDataHours([...listDataHours, option]);
  };

  const handleOptionsMentoring = (target) => {
    mentoringOption.forEach((option) => {
      if (target.value === option.value) {
        // eslint-disable-next-line
        option.checked = target.checked;
      }
    });
    setMentoringOption(mentoringOption);
  };

  function normalizeDateTime(dateTime) {
    const uniqueDateTime = [];
    let alreadyInclude = false;
    dateTime.forEach((el) => {
      uniqueDateTime.forEach((unique) => {
        if (el.day === unique.date && el.times[0].hour === unique.hour) {
          alreadyInclude = true;
        }
      });
      if (!alreadyInclude) {
        uniqueDateTime.push({ date: el.day, hour: el.times[0].hour });
      }
      alreadyInclude = false;
    });
    setListDataHours(uniqueDateTime);
  }

  function setOptions(elements) {
    const options = [
      { name: 'Online', checked: false, value: 'Online' },
      { name: 'Presencial', checked: false, value: 'Presencial' },
    ];
    if (elements !== null) {
      options.forEach((option) => {
        if (Array.isArray(elements)) {
          elements.forEach((el) => {
            if (el === option.value) {
              // eslint-disable-next-line
              option.checked = true;
            }
          });
        } else if (elements === option.value) {
          // eslint-disable-next-line
          option.checked = true;
        }
      });
    }
    setMentoringOption(options);
  }

  useEffect(() => { // did Mount
    const token = sessionStorage.getItem('token');
    profile({ headers: { Authorization: `Bearer ${token}` } }).then((res) => {
      setKnowledgeArea(res.data.areas);
    });


    if (oldMentoria && oldMentoria.data.dateTime) {
      normalizeDateTime(oldMentoria.data.dateTime);
    } else {
      handleAdd('Segunda', '09:00');
    }

    if (oldMentoria && oldMentoria.data.mentoringOption) {
      setOptions(oldMentoria.data.mentoringOption);
    } else {
      setOptions(null);
    }
  }, []);


  return (
    <Container>
      <Container.Form>
        <Container.Options>
          <RedeTextField
            descricao="Título"
            valor={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!!oldMentoria}
          />
          <RedeTextArea
            descricao="Descrição"
            valor={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Espaco size="18px" />
          <RedeTextField
            descricao="Área de Conhecimento"
            valor={knowledgeArea}
            onChange={(e) => setKnowledgeArea(e.target.value)}
            disabled
          />
          <input id="fileButton" type="file" hidden />
          <DivImage image={imageUrl}>
            <DivImage.Img src={imageUrl} />
          </DivImage>
          <RedeButton descricao="Adicionar Foto" claro onClick={handleImage} />
        </Container.Options>
        <RedeHorizontalSeparator />
        <Container.SecondOption>
          <DivCheckbox>
            <RedeFormLabel descricao="Opções de Mentoria" />
            <DivCheckbox.Options>
              {
                mentoringOption.map((option) => (
                  <Checkbox
                    value={option.value}
                    checked={option.checked}
                    label={option.name}
                    onChange={(e) => handleOptionsMentoring(e.target)}
                  />
                ))
              }
            </DivCheckbox.Options>
          </DivCheckbox>
          <Espaco size="12px" />
          <RedeFormLabel descricao="Datas e Horários Disponíveis" />

          <DivSelect className="select-data-horarios">
            <DivSelect.Labels>
              <p>Data</p>
              <p style={{ marginLeft: '70px' }}>Horários</p>
            </DivSelect.Labels>
            {
              listDataHours.map((select, index) => (
                <ContainerDataHora key={select.id}>
                  <>
                    <Select
                      key={daysSelect}
                      options={daysSelect}
                      select={select.date}
                      onChange={(event) => setValueDate(index, event.target.value)}
                    />
                    <Select
                      key={hoursSelect}
                      options={hoursSelect}
                      select={select.hour}
                      onChange={(event) => setValueHour(index, event.target.value)}
                    />
                  </>
                  {index === (listDataHours.length - 1) && listDataHours.length < 6
                    // eslint-disable-next-line
                    ? <img onClick={() => handleAdd('Segunda', '09:00')} src={plusButton} alt="Adicionar" />
                    // eslint-disable-next-line
                    : <img onClick={() => handleRemove(index)} src={removeButton} alt="Remover" />}
                </ContainerDataHora>
              ))
            }
          </DivSelect>
        </Container.SecondOption>
      </Container.Form>
      <Container.Submit>
        <RedeButton descricao="Cancelar" cancelar onClick={(e) => cleanForm(e)} />
        <RedeButton descricao={ActionButtonTitle} onClick={handleAddMentoria} />

      </Container.Submit>
    </Container>
  );
}


export default CadastroMentoria;
