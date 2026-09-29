import React from 'react';
import { string, func, bool, objectOf, any } from 'prop-types';
import Button from './StyledComponents';
import RefreshIcon from '../../assets/RefreshIcon';

const RedeButton = ({
  descricao, onClick, desabilitado, cancelar, claro, loading, buttonProps,
}) => (
  <Button
    onClick={onClick}
    disabled={desabilitado || loading}
    cancelar={cancelar}
    claro={claro}
    loading={loading}
    {...buttonProps}
  >
    {loading && (
    <>
      <RefreshIcon />
    </>
    )}
    {descricao}
  </Button>
);

RedeButton.propTypes = {
  descricao: string,
  onClick: func,
  desabilitado: bool,
  cancelar: bool,
  claro: bool,
  loading: bool,
  buttonProps: objectOf(any),
};

RedeButton.defaultProps = {
  descricao: '',
  desabilitado: false,
  cancelar: false,
  claro: false,
  loading: false,
  onClick: () => { },
  buttonProps: {},
};

export default RedeButton;
