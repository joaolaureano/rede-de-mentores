import React from 'react';
import { withInfo } from '@storybook/addon-info';
import RedeInputSearch from './RedeInputSearch';

export default {
  title: 'RedeInputSearch',
  component: RedeInputSearch,
  decorators: [withInfo],
};

export const Input = () => <RedeInputSearch placeholder="Procurar por área" />;
