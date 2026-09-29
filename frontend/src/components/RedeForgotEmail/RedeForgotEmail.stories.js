import React from 'react';
import RedeForgotEmail from './RedeForgotEmail';

export default {
  title: 'RedeForgotEmail',
  component: RedeForgotEmail,
};

export const Default = () => {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Abrir Modal</button>
      <RedeForgotEmail
        email={email}
        onChangeEmail={(evt) => setEmail(evt.target.value)}
        opened={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
