import React from 'react';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import RedeButton from './RedeButton';

export default {
  title: 'RedeButton',
  component: RedeButton,
  decorators: [withInfo],
};

export const Default = () => <RedeButton descricao="Teste" onClick={action('Clicou')} />;
export const Loading = () => <RedeButton descricao="Teste" onClick={action('Clicou')} loading />;
export const Disabled = () => <RedeButton descricao="Teste" onClick={action('Clicou')} desabilitado />;
export const AzulClaro = () => <RedeButton descricao="Teste" onClick={action('Clicou')} claro />;
export const Cancelar = () => <RedeButton descricao="Teste" onClick={action('Clicou')} cancelar />;
