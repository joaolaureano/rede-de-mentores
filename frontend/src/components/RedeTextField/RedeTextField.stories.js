import React from 'react';
import { withInfo } from '@storybook/addon-info';
import RedeTextField from './RedeTextField';

export default {
  title: 'RedeTextField',
  component: RedeTextField,
  decorators: [withInfo],
};

export const Email = () => <RedeTextField descricao="Email" />;
export const Senha = () => <RedeTextField descricao="Senha" tipo="password" />;
export const Erro = () => <RedeTextField descricao="Senha" tipo="password" erro msgAjuda="Mensagem de Ajuda" />;
export const Desabilitado = () => <RedeTextField descricao="Email" disabled />;
