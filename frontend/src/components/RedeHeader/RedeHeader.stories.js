import React from 'react';
import { withInfo } from '@storybook/addon-info';
import RedeHeader from './RedeHeader';

export default {
  title: 'RedeHeader',
  component: RedeHeader,
  decorators: [withInfo],
};

export const Default = () => <RedeHeader descricao="TESTE" />;
