import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import {
  Container,
} from '@material-ui/core';
import StyledContainer from './StyledComponents';
import Titulo from './StyledComponents/Titulo';
import Tabela from './StyledComponents/Tabela';
import { getAll, profile } from '../../services/user';
import RedeCheckbox from '../../components/RedeCheckbox/RedeCheckbox';
import TableHeaderEvolve from './StyledComponents/TableHeaderEvolve';
import { userTypes } from '../../utils/userType.constants';
import { useHistory } from 'react-router';
import pushIfNecessary from '../../utils/HTMLUtils';

function ListagemUsuarios() {
  const { enqueueSnackbar } = useSnackbar();
  const [usuarios, setUsuarios] = useState([]);
  const [checkMentor, setCheckMentor] = useState(true);
  const [checkMentorado, setCheckMentorado] = useState(true);
  const history = useHistory();


  const enqueue = (msg = '', variant = 'error', autoHideDuration = 2500) => {
    enqueueSnackbar(msg, { variant, autoHideDuration });
  };

  useEffect(() => {
    const tkn = sessionStorage.getItem('token');
    profile({ headers: { Authorization: `Bearer ${tkn}` } }).then((resp) => {
      if (resp.data.userType !== userTypes.ADMINISTRADOR) {
        pushIfNecessary(
          resp.data.userType,
          (link) => history.push(link),
        );
      } else {
        getAll(
          { headers: { Authorization: `Bearer ${tkn}` } },
        ).then((resposta) => {
          setUsuarios(resposta.data);
        })
          .catch(() => enqueue('Erro ao pesquisar usuários!'));
      }
    }).catch((erro) => {
      enqueue(erro.response.data);
      history.push();
    });
  }, []);

  const getUserTypeName = (userType) => {
    switch (userType) {
      case 0: return 'Administrador';
      case 1: return 'Mentor';
      case 2: return 'Mentorado';
      case 3: return 'Ambos';
      default: return 'Padrão';
    }
  };

  return (
    <Container>
      <StyledContainer>
        <Titulo>Listagem de Usuários</Titulo>
        <Tabela>
          <thead>
            <tr>
              <th colSpan={5}>
                <TableHeaderEvolve>
                  <div>
                    <RedeCheckbox
                      id="mentores"
                      checked={checkMentor}
                      onChange={(evt) => setCheckMentor(evt.target.checked)}
                      claro
                    />
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label htmlFor="mentores" style={{ marginLeft: '5px' }}>
                      Mentores
                    </label>
                  </div>
                  <div>
                    <RedeCheckbox
                      id="mentorados"
                      checked={checkMentorado}
                      onChange={(evt) => setCheckMentorado(evt.target.checked)}
                      claro
                    />
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label htmlFor="mentorados" style={{ marginLeft: '5px' }}>
                      Mentorados
                    </label>
                  </div>
                </TableHeaderEvolve>
              </th>
            </tr>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {usuarios
              .filter((usuario) => {
                const arr = [];
                if (checkMentor) arr.push(1);
                if (checkMentorado) arr.push(2);
                if (checkMentor || checkMentorado) arr.push(3);
                return arr.indexOf(usuario.data.userType) > -1;
              })
              .map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.data.name}</td>
                  <td>{usuario.data.email}</td>
                  <td>{usuario.data.cpf}</td>
                  <td>{usuario.data.phone}</td>
                  <td>{getUserTypeName(usuario.data.userType)}</td>
                </tr>
              ))}
          </tbody>
        </Tabela>
      </StyledContainer>
    </Container>
  );
}

export default ListagemUsuarios;
