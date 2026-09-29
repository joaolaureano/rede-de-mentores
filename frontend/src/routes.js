import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Logon from './pages/login/Login';
import CadastroMentor from './pages/cadastro-mentor/CadastroMentor';
import Main from './pages/main';
import Register from './pages/register/Register';
import Mentor from './pages/mentor/Mentor';
import CadastroMentorado from './pages/cadastro-mentorado/CadastroMentorado';
import CadastroMentoria from './pages/cadastro-mentoria/CadastroMentoria';
import MentoriasDisponiveis from './pages/mentorias/MentoriasDisponiveis';
import Mentoria from './pages/mentoria/Mentoria';
import Administrador from './pages/adm/Adm';
import Mentorado from './pages/mentorado/Mentorado';
import RedeHeader from './components/RedeHeader/RedeHeader';
import NovaSenha from './pages/novaSenha/novaSenha';
import ListagemUsuarios from './pages/listagemUsuarios/listagemUsuarios';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Logon} />
        <Route path="/" component={RedeHeader} />
      </Switch>
      <Switch>
        <Route path="/cadastro-mentor" component={CadastroMentor} />
        <Route path="/cadastro-mentorado" component={CadastroMentorado} />
        <Route path="/cadastro-mentoria" component={CadastroMentoria} />
        <Route path="/main" component={Main} />
        <Route path="/register" component={Register} />
        <Route path="/mentor" component={Mentor} />
        <Route path="/mentoria" component={Mentoria} />
        <Route path="/mentorias-disponiveis" component={MentoriasDisponiveis} />
        <Route path="/administrador" component={Administrador} />
        <Route path="/mentorado" component={Mentorado} />
        <Route path="/nova-senha/:id" component={NovaSenha} />
        <Route path="/listagem-usuarios" component={ListagemUsuarios} />
      </Switch>
    </BrowserRouter>
  );
}
