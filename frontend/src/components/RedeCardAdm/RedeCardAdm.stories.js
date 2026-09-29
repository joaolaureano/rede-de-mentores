import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withInfo } from '@storybook/addon-info';
import RedeCard from './RedeCardAdm';
import imagem from '../../assets/teacher.png';

export default {
  title: 'RedeCard',
  component: RedeCard,
  decorators: [withInfo],
};

export const Default = () => (
  <RedeCard
    description="Descrição da mentoria"
    title="Título da mentoria"
  />
);
export const NotVisible = () => (
  <RedeCard description="Descrição" title="Título" visible={false} />
);
export const DefaultMentoras = () => (
  <RedeCard
    description="Descrição"
    title="Título"
    mentorias
    mentorName="Professor Carlos"
    mentorImage={imagem}
  />
);
