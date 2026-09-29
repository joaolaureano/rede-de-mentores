import React, { useEffect, useState } from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { useHistory } from 'react-router';
import logo from '../../assets/logo2.png';
import { profile as getUser } from '../../services/user';
import Container from './StyledComponents';
import { urlFiles } from '../../services/http';
import standartPhoto from '../../assets/account.png';
import { userTypes } from '../../utils/userType.constants';

// const getTitle = () => sessionStorage.getItem('headerTitle');
const excludedPaths = ['/', '/register', '/cadastro-mentor', '/cadastro-mentorado', '/nova-senha'];

const RedeHeader = (props) => {
  const [tkn, setTkn] = useState(null);
  const [profile, setProfile] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [title, setTitle] = useState('');
  const history = useHistory();

  const logOut = () => {
    sessionStorage.removeItem('token');
    setProfile(null);
    history.push('/');
  };

  useEffect(() => { // ComponentDidMount
    setTitle(''); // TODO: Tirar esse setTitle();
    const tknValue = sessionStorage.getItem('token');
    const path = props && props.location && props.location.pathname ? props.location.pathname : '';
    if (!tknValue && excludedPaths.indexOf(path) === -1 && !String(path).match(/(nova-senha\/.*)/)) {
      history.push('/');
    }
  }, []);

  useEffect(() => { // ComponentDidUpdate
    const tknValue = sessionStorage.getItem('token');
    if (tknValue !== tkn) {
      setTkn(tknValue);
    }
  });

  useEffect(() => { // Ao Mudar o tkn
    if (!tkn) return;
    getUser({ headers: { Authorization: `Bearer ${tkn}` } }).then((resp) => {
      setProfile(resp.data);
    }).catch((erro) => {
      console.error(erro);
      logOut();
    });
  }, [tkn]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('homeEscolhida');
    logOut();
    handleMenuClose();
  };

  const handleEditProfile = () => {
    sessionStorage.setItem('oldProfile', JSON.stringify(profile));
    let to = '';
    switch (profile.userType) {
      case userTypes.ADMINISTRADOR:
      case userTypes.MENTOREMENTORADO:
        to = sessionStorage.getItem('homeEscolhida')
          ? `/cadastro-${sessionStorage.getItem('homeEscolhida')}`
          : '/cadastro-mentor';
        break;
      case userTypes.MENTOR:
        to = '/cadastro-mentor';
        break;
      case userTypes.MENTORADO:
        to = '/cadastro-mentorado';
        break;
      default:
        return;
    }
    history.push(to);
    handleMenuClose();
  };

  const handleLogoClick = () => {
    let to = '/';
    if (!profile || (!profile.userType && profile.userType !== 0)) return history.push(to);
    switch (profile.userType) {
      case userTypes.ADMINISTRADOR:
        to = '/administrador';
        break;
      case userTypes.MENTOREMENTORADO:
        to = sessionStorage.getItem('homeEscolhida')
          ? `/${sessionStorage.getItem('homeEscolhida')}`
          : '/mentor';
        break;
      case userTypes.MENTOR:
        to = '/mentor';
        break;
      case userTypes.MENTORADO:
        to = '/mentorado';
        break;
      default:
        return '';
    }
    return history.push(to);
  };

  const escolherHome = (path, sessionSave = true) => {
    if (sessionSave) {
      sessionStorage.setItem('homeEscolhida', path);
    }
    history.push(`/${path}`);
    handleMenuClose();
  };

  return (
    <>
      <Container>
        <Container.Logo src={logo} onClick={handleLogoClick} />
        <Container.Title>{title}</Container.Title>
        {
          profile ? (
            <Container.ImgProfile
              onClick={handleProfileMenuOpen}
              src={profile ? `${urlFiles}/${profile.image}` : standartPhoto}
            />
          ) : (<div />)
        }

      </Container>
      <Container.Clearfix />
      {
        profile && (
          <Menu
            id="user-menu"
            className="header-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { }} disabled>{profile ? profile.name : ''}</MenuItem>
            {profile.userType === userTypes.ADMINISTRADOR && props && props.location && props.location.pathname !== ('/administrador')
              && (<MenuItem onClick={() => escolherHome('administrador', false)}>Home Administrador</MenuItem>)}
            {(profile.userType === userTypes.MENTOREMENTORADO
              || profile.userType === userTypes.ADMINISTRADOR)
              && (
                sessionStorage.getItem('homeEscolhida') !== 'mentor'
              )
              && (
                <MenuItem onClick={() => escolherHome('mentor')}>Home Mentor</MenuItem>
              )}
            {(profile.userType === userTypes.MENTOREMENTORADO
              || profile.userType === userTypes.ADMINISTRADOR)
              && (
                sessionStorage.getItem('homeEscolhida') !== 'mentorado'
              )
              && (
                <MenuItem onClick={() => escolherHome('mentorado')}>Home Mentorado</MenuItem>
              )}
            {
              profile.userType === userTypes.ADMINISTRADOR
              && <MenuItem onClick={() => history.push('/listagem-usuarios')}>Listagem de Usuários</MenuItem>
            }
            {
              (profile.userType !== userTypes.ADMINISTRADOR)
              && <MenuItem onClick={handleEditProfile}>Editar perfil</MenuItem>
            }
            <MenuItem onClick={handleLogOut}>Sair</MenuItem>
          </Menu>

        )
      }
    </>
  );
};

RedeHeader.propTypes = {
};

RedeHeader.defaultProps = {
};

export default RedeHeader;
