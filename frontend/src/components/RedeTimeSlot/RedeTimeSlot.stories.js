import React from 'react';
import { withInfo } from '@storybook/addon-info';
import RedeTimeSlot from './RedeTimeSlot';

export default {
  title: 'RedeTimeSlot',
  component: RedeTimeSlot,
  decorators: [withInfo],
};

export const Default = () => <RedeTimeSlot descricao="SEG - 10:30" deselecionado = 'true'/>;
export const Enabled = () => <RedeTimeSlot descricao="SEG - 10:30" selecionado = 'true'/>;