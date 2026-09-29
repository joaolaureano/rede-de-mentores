import React from 'react';
import { withInfo } from '@storybook/addon-info';
import RedeProfileInfo from './RedeProfileInfo';
import teacher from '../../assets/teacher.png'
export default {
  title: 'RedeProfileInfo',
  component: RedeProfileInfo,
  decorators: [withInfo],
};

export const Default = () => <RedeProfileInfo linkedin = "/test" image = {teacher} name = "MARY MARIE"/>;