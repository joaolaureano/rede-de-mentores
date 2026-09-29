import React, { useState } from 'react';
import { string, func, bool } from 'prop-types';
import { Dialog } from '@material-ui/core';
import './RedeMarcarMentoria.css';
import plus from '../../assets/plus.png';
import RedeTextArea from '../RedeTextArea/RedeTextArea';
import RedeButton from '../RedeButton/RedeButton';

const RedeMarcarMentoria = ({
  image, title, userImage, userName, date, hour, onConfirm, opened, onClose,
  // descricao, onClick, desabilitado, cancelar, claro, loading,
}) => {
  const [descricao, setDescricao] = useState('');
  const [tipoMentoria, setTipoMentoria] = useState('');
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setDescricao('');
      setTipoMentoria('');
    }, 400);
  };

  const confirm = () => {
    handleClose();
    onConfirm({
      typeMentoring: tipoMentoria,
      descProject: descricao,
      date,
      hour,
    });
  };

  return (
    <Dialog open={opened} onClose={handleClose} className="rede-marcar-mentoria">
      <div className="content">
        <button type="button" className="close-icon" onClick={handleClose}>
          <img src={plus} alt="fechar" />
        </button>
        <div className="bloco info">
          <div className="foto-mentoria">
            <img src={image} alt="mentoria" />
          </div>
          <div className="informacao">
            <div className="titulo">
              {title}
            </div>
            <div className="mentor">
              <div className="mentor-foto">
                <img src={userImage} alt={userName} />
              </div>
              <div className="mentor-nome">{userName}</div>
            </div>
            <div className="data-hora">
              <div className="data">{date}</div>
              <div className="traco">-</div>
              <div className="hora">{hour}</div>
            </div>
          </div>
        </div>
        <div className="subtitulo">Descrição resumida do projeto:</div>
        <div className="bloco descricao">
          <RedeTextArea
            valor={descricao}
            onChange={(evt) => setDescricao(evt.target.value)}
          />
        </div>
        <div className="radios">
          <label htmlFor="online">
            <input type="radio" id="online" name="tipo" value="Online" checked={tipoMentoria === 'Online'} onChange={(evt) => setTipoMentoria(evt.target.value)} />
            Online
          </label>
          <label htmlFor="presencial">
            <input type="radio" id="presencial" name="tipo" value="Presencial" checked={tipoMentoria === 'Presencial'} onChange={(evt) => setTipoMentoria(evt.target.value)} />
            Presencial
          </label>
        </div>
        <div className="botao">
          <RedeButton
            descricao="MARCAR MENTORIA"
            onClick={confirm}
            desabilitado={!tipoMentoria || !descricao}
          />
        </div>

      </div>
    </Dialog>
  );
};

RedeMarcarMentoria.propTypes = {
  opened: bool.isRequired,
  onClose: func.isRequired,
  image: string,
  title: string,
  userImage: string,
  userName: string,
  date: string,
  hour: string,
  onConfirm: func,
};

RedeMarcarMentoria.defaultProps = {
  image: '',
  title: '',
  userImage: '',
  userName: '',
  date: '',
  hour: '',
  onConfirm: () => { },
};

export default RedeMarcarMentoria;

// <Button
//   onClick={onClick}
//   disabled={desabilitado || loading}
//   cancelar={cancelar}
//   claro={claro}
//   loading={loading}
// >
//   {loading && (
//   <>
//     <RefreshIcon />
//   </>
//   )}
//   {descricao}
// </Button>
