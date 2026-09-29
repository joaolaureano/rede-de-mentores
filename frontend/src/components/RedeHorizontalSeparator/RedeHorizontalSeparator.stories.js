import React from 'react';
import { withInfo } from '@storybook/addon-info';
import RedeHorizontalSeparator from './RedeHorizontalSeparator';

export default {
  title: 'RedeHorizontalSeparator',
  component: RedeHorizontalSeparator,
  decorators: [withInfo],
};

export const Separator = () => <RedeHorizontalSeparator />;
