import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useSnackbar } from 'notistack';
import AccountImage from '../../assets/account.png';
import { cadastrarUsuario, profile, editarUsuario } from '../../services/user';
import { formatCPF, formatTelefone } from '../../utils/maskUtils';
import Container from './StyledComponents';
import RedeButton from '../../components/RedeButton/RedeButton';
import RedeTextField from '../../components/RedeTextField/RedeTextField';
import RedeHorizontalSeparator from '../../components/RedeHorizontalSeparator/RedeHorizontalSeparator';
import RedeSelect from '../../components/RedeSelect/RedeSelect';
import RedeCheckbox from '../../components/RedeCheckbox/RedeCheckbox';
import { urlFiles } from '../../services/http';
import { availableAreas as getAvailableAreas } from '../../services/areas';
import pushIfNecessary from '../../utils/HTMLUtils';
import { userTypes } from '../../utils/userType.constants';
import validateEmail from '../../utils/validationUtils';

function CadastroMentor() {
  const history = useHistory();
  const [sent, setSent] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [image, setImage] = useState('');
  const [phone, setPhone] = useState('');
  const [areas, setAreas] = useState('');
  const [availableAreas, setAvailableAreas] = useState([]);
  const [imageurl, setImageurl] = useState(AccountImage);
  const [acceptTerms, setAcceptTerms] = useState('');
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const enqueue = (msg = '', variant = 'error', autoHideDuration = 2500) => {
    enqueueSnackbar(msg, { variant, autoHideDuration });
  };

  const erroSenha = Boolean(password && confirmPassword && password !== confirmPassword);
  const erroCpf = (sent && cpf && !cpf.match(/\d{3}\.\d{3}\.\d{3}-\d{2}/));
  const erroTelefone = (sent && phone && !phone.match(/\(\d{2}\)\s{1}\d{4,5}-\d{4}/));
  const disableButton = (_sent = sent) => (
    _sent
    && (!name
      || !cpf
      || !email
      || !password
      || !confirmPassword
      || !linkedin
      // || !image
      || !phone
      || !areas
      || !acceptTerms
      || erroCpf
      || erroTelefone
      || erroSenha)
  );

  useEffect(() => { // ComponentDidMount
    getAvailableAreas().then((res) => {
      const arrayAreas = [];
      res.data.forEach((area) => {
        arrayAreas.push(area.name);
      });
      setAvailableAreas(arrayAreas);
    });


    const old = sessionStorage.getItem('oldProfile');
    const tkn = sessionStorage.getItem('token');
    // sessionStorage.setItem('headerTitle', `${old ? 'Edição' : 'Cadastro'} Mentor`);
    if (!old && tkn) {
      profile({ headers: { Authorization: `Bearer ${tkn}` } }).then((resp) => {
        if (resp.data.userType === userTypes.ADMINISTRADOR) {
          history.push('/administrador');
          return;
        }
        pushIfNecessary(
          resp.data.userType,
          (link) => history.push(link),
        );
      });
    }
    if (old) {
      setIsEditing(true);
      const oldProfile = JSON.parse(old);
      setName(oldProfile.name);
      setCpf(oldProfile.cpf);
      setEmail(oldProfile.email);
      setPassword(oldProfile.password);
      setConfirmPassword(oldProfile.confirmPassword);
      setLinkedin(oldProfile.linkedin);
      setPhone(oldProfile.phone);
      setAreas(oldProfile.areas);
      setImageurl(`${urlFiles}/${oldProfile.image}`);
    }
    return () => {
      sessionStorage.removeItem('oldProfile');
      sessionStorage.removeItem('headerTitle');
    };
    // eslint-disable-next-line
  }, []);

  const attemptRegister = (event) => {
    setSent(true);
    event.preventDefault();
    if (disableButton(true)) return;

    const data = new FormData();
    data.append('image', image);
    data.append('name', name);
    data.append('email', email);
    data.append('phone', phone);
    data.append('linkedin', linkedin);
    data.append('cpf', cpf);
    data.append('password', password);
    data.append('areas[]', areas);
    data.append('userType', 1);

    if (
      !data.get('name')
      || !data.get('email')
      || !data.get('phone')
      || !data.get('linkedin')
      || !data.get('cpf')
      || !data.get('areas[]')
      || !data.get('password')
      || !confirmPassword
    ) {
      enqueue('Preencha todos os campos.');
    } else if (!data.get('image')) {
      enqueue('Insira uma foto de perfil.');
    } else if (
      data.get('password')
      && confirmPassword
      && data.get('password') !== confirmPassword
    ) {
      enqueue('Senhas não são iguais.');
    } else if (!acceptTerms) {
      enqueue('Você precisa aceitar o Termo de Privacidade para efetuar o cadastro.');
    } else if (!validateEmail(data.get('email'))) {
      enqueue('Fomato incorreto de e-mail.');
    } else {
      setLoading(true);
      cadastrarUsuario(data)
        .then((res) => {
          if (res.status === 200) {
            enqueue('Usuário cadastrado com sucesso!', 'success');
            history.push('/');
          }
        })
        .catch(() => {
          enqueue('Não foi possível realizar o cadastro. ');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const attemptEdit = () => {
    setLoading(true);
    const oldProfile = JSON.parse(sessionStorage.getItem('oldProfile'));
    const tkn = sessionStorage.getItem('token');
    const headers = { headers: { Authorization: `Bearer ${tkn}` } };
    const data = new FormData();
    data.append('image', image || oldProfile.image);
    data.append('name', name);
    data.append('email', email);
    data.append('phone', phone);
    data.append('linkedin', linkedin);
    data.append('cpf', cpf);
    data.append('areas[]', areas);
    data.append('userType', oldProfile.userType);
    editarUsuario(data, headers)
      .then((resp) => {
        sessionStorage.setItem('token', resp.data.token);
        enqueue('Usuário alterado com sucesso!', 'success');
        pushIfNecessary(
          userTypes.MENTOR,
          (link) => history.push(link),
        );
      })
      .catch(() => {
        enqueue('Não foi possível editar, tente novamente.');
      }).finally(() => {
        setLoading(false);
      });
  };

  const handleImage = () => {
    let url;
    document.getElementById('fileButton').click();
    document.getElementById('fileButton').onchange = (event) => {
      const imageType = (event.target.files[0]) ? event.target.files[0].type : null;

      if (!['image/jpg', 'image/jpeg'].includes(imageType)) {
        return enqueue('A imagem precisa ser JPG/JPEG');
      }

      try {
        url = URL.createObjectURL(event.target.files[0]);
      } catch (e) {
        url = imageurl;
      }
      setImage(event.target.files[0]);
      setImageurl(url);
      return '';
    };
  };
  const ajudaCpf = () => {
    if (sent && !cpf) return 'CPF é obrigatório!';
    if (erroCpf) return 'CPF inválido!';
    return '';
  };

  const ajudaTelefone = () => {
    if (sent && !phone) return 'Telefone é obrigatório!';
    if (erroTelefone) return 'Telefone inválido!';
    return '';
  };

  const ajudaEmail = () => {
    if (sent && !email) return 'Email é obrigatório!';
    if (sent && email && !validateEmail(email)) return 'Email inválido!';
    return '';
  };

  const confirmSenhaAjuda = () => {
    if (sent && !confirmPassword) return 'Confirme sua senha!';
    if (erroSenha) return 'Senhas não conferem!';
    return '';
  };

  const leftSide = (
    <>
      <RedeTextField
        descricao="Nome Completo"
        valor={name}
        erro={sent && !name}
        msgAjuda={sent && !name ? 'Nome é obrigatório!' : undefined}
        onChange={(evt) => setName(evt.target.value)}
      />
      <RedeTextField
        descricao="CPF"
        valor={cpf}
        erro={erroCpf || (sent && !cpf)}
        msgAjuda={ajudaCpf()}
        onChange={(evt) => setCpf(formatCPF(evt.target.value))}
      />
      <RedeTextField
        descricao="Telefone"
        valor={phone}
        erro={erroTelefone || (sent && !phone)}
        msgAjuda={ajudaTelefone()}
        onChange={(evt) => setPhone(formatTelefone(evt.target.value))}
      />
      <RedeSelect
        options={availableAreas}
        select={areas}
        erro={sent && !areas}
        msgAjuda={sent && !areas ? 'Area é obrigatório!' : ''}
        onChange={(evt) => setAreas(evt.target.value)}
      />
      <RedeTextField
        descricao="LinkedIn"
        valor={linkedin}
        erro={sent && !linkedin}
        msgAjuda={sent && !linkedin ? 'LinkedIn é obrigatório' : undefined}
        onChange={(evt) => setLinkedin(evt.target.value)}
      />
    </>
  );

  const rightSide = (
    <>
      <RedeTextField
        descricao="Email"
        valor={email}
        erro={sent && (!email || !validateEmail(email))}
        msgAjuda={ajudaEmail()}
        onChange={(evt) => setEmail(evt.target.value)}
      />
      {(isEditing) ? (
        <>
          <Container>
            <RedeButton descricao="Editar perfil" onClick={attemptEdit} loading={loading} />
          </Container>
        </>
      )
        : (
          <>
            <RedeTextField
              descricao="Senha"
              tipo="password"
              valor={password}
              erro={sent && !password}
              msgAjuda={(sent && !password) ? 'Senha é obrigatório' : undefined}
              onChange={(evt) => setPassword(evt.target.value)}
            />
            <RedeTextField
              descricao="Confirmação de Senha"
              tipo="password"
              valor={confirmPassword}
              onChange={(evt) => setConfirmPassword(evt.target.value)}
              msgAjuda={confirmSenhaAjuda()}
              erro={sent && (erroSenha || !confirmPassword)}
            />

            <Container.FlexContainer style={{ flexDirection: 'row' }}>
              <RedeCheckbox
                id="termos"
                value={acceptTerms}
                onChange={(evt) => setAcceptTerms(evt.target.checked)}
              />
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="termos" style={{ marginTop: '5px' }}>
                Aceito os termos de uso
              </label>
            </Container.FlexContainer>

            <Container>
              <RedeButton descricao="Cadastrar" onClick={attemptRegister} desabilitado={disableButton()} loading={loading} />
            </Container>
          </>
        )}
    </>
  );
  return (
    <Container>
      <Container.FlexContainer style={{ marginTop: '10px' }}>
        <Container.Item style={{ textAlign: 'center' }}>
          <Container.UserImage src={imageurl} />
          <input id="fileButton" type="file" hidden />
          <Container style={{ marginBottom: '2vh' }}>
            <RedeButton descricao="Adicionar Foto" claro onClick={handleImage} />
          </Container>
        </Container.Item>
      </Container.FlexContainer>

      <Container.FlexContainer>
        {(isEditing)
          ? (
            <>
              <Container.Item>
                {leftSide}
                {rightSide}
              </Container.Item>
            </>
          )
          : (
            <>
              <Container.Item>
                {leftSide}
              </Container.Item>

              <RedeHorizontalSeparator />

              <Container.Item>
                {rightSide}
              </Container.Item>
            </>
          )}

      </Container.FlexContainer>
    </Container>
  );
}

export default CadastroMentor;
