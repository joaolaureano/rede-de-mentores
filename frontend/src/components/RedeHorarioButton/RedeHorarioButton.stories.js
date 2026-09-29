import React from 'react';
import { withInfo } from '@storybook/addon-info';
import RedeHorarioButton from './RedeHorarioButton';

export default {
  title: 'RedeHorarioButton',
  component: RedeHorarioButton,
  decorators: [withInfo],
};

export const Padrao = () => <RedeHorarioButton horario="22:45" onClick={() => console.log('click')} />;
export const Ocupado = () => <RedeHorarioButton horario="22:45" onClick={() => console.log('click')} ocupado />;
export const Desabilitado = () => <RedeHorarioButton horario="22:45" onClick={() => console.log('click')} desabilitado />;
