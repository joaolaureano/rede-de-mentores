import React from 'react';
import { withInfo } from '@storybook/addon-info';
import RedeHorarioCard from './RedeHorarioCard';

export default {
  title: 'RedeHorarioCard',
  component: RedeHorarioCard,
  decorators: [withInfo],
};

export const Default = () => <RedeHorarioCard />

