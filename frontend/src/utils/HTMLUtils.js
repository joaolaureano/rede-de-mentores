import { userTypes } from './userType.constants';

export default function pushIfNecessary(userType = '', callBack) {
  const escolhida = sessionStorage.getItem('homeEscolhida');
  if (typeof callBack !== 'function') return '';
  switch (userType) {
    case userTypes.ADMINISTRADOR:
      callBack('/administrador');
      break;
    case userTypes.MENTOR:
      callBack('/mentor');
      break;
    case userTypes.MENTORADO:
      callBack('/mentorado');
      break;
    case userTypes.MENTOREMENTORADO:
      if (!escolhida) sessionStorage.setItem('homeEscolhida', 'mentor');
      callBack(`/${escolhida || 'mentor'}`);
      break;
    default:
      return '';
  }
  return '';
}
