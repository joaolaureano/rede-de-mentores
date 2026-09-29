import React from 'react';
import { withInfo } from '@storybook/addon-info';
import RedeMarcarMentoria from './RedeMarcarMentoria';

export default {
  title: 'RedeMarcarMentoria',
  component: RedeMarcarMentoria,
  decorators: [withInfo],
};

export const Default = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Abrir Modal</button>
      <RedeMarcarMentoria
        opened={open}
        image="https://dev.observatoriodocinema.bol.uol.com.br/wp-content/uploads/2020/06/Lucifer-1.jpg"
        title="MENTORIA DOS DESEJOS"
        userName="Lucifer Morningstar"
        userImage="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQfBdI21oSQQ1LqYxuDeprAalebgLjC0LnXrnLRuZ_7yof0Ah7i&usqp=CAU"
        date="29/03/2020"
        hour="19:00"
        onClose={() => setOpen(false)}
        onConfirm={(evt) => console.log('Mentoria: ', evt)}
      />
    </>
  );
};
