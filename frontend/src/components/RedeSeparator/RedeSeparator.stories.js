import React from 'react';
import { withInfo } from '@storybook/addon-info';
import RedeSeparator from './RedeSeparator';

export default {
  title: 'RedeSeparator',
  component: RedeSeparator,
  decorators: [withInfo],
};

export const Separator = () => <RedeSeparator descricao="Teste" />;
