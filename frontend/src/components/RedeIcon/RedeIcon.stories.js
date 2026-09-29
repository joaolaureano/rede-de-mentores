import React from 'react';
import { withInfo } from '@storybook/addon-info';
import RedeIcon from './RedeIcon';
import edition from '../../assets/create-new-pencil-button.png';

export default {
  title: 'RedeIcon',
  component: RedeIcon,
  decorators: [withInfo],
};

export const Default = () => <RedeIcon imageUrl = {edition}/>;