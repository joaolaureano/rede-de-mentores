import React from 'react';
import { withInfo } from '@storybook/addon-info';
import RedeTextArea from './RedeTextArea';

export default {
  title: 'RedeTextArea',
  component: RedeTextArea,
  decorators: [withInfo],
};

export const Default = () => <RedeTextArea descricao="Descrição" />;
