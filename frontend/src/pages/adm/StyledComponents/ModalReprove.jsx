import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import RedeButton from '../../../components/RedeButton/RedeButton';

const ModalReprove = ({
  open,
  handleClose,
  evaluateMentoring,
}) => (
  <div>
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Indeferir Mentoria</DialogTitle>
      <DialogContent>
        <DialogContentText>Tem certeza que deseja indeferir esta mentoria?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <RedeButton
          descricao="Não"
          onClick={handleClose}
          cancelar
        />
        <RedeButton
          descricao="Sim"
          onClick={evaluateMentoring}
        />
      </DialogActions>
    </Dialog>
  </div>
);

export default ModalReprove;
