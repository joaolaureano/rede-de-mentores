/* eslint-disable import/prefer-default-export */

export const getUnmaskedValue = (value) => String(value).replace(/\D/g, '');

export const formatCPF = (input) => {
  const value = String(input) // Transforma em String
    .replace(/\D/g, '') // Retira o que não é número
    .slice(0, 11) // Limita o tamanho
    .replace(/(\d{3})(\d{1,3})/, '$1.$2') // Coloca o primeiro ponto
    .replace(/(\d{3})(\d{1,3})/, '$1.$2') // Coloca o segundo ponto
    .replace(/(\d{3}\.{1}\d{3}\.{1}\d{3})(\d{1,2})/, '$1-$2'); // Coloca o traço
  return value;
};

export const formatTelefone = (input) => {
  const value = String(input) // Transforma em String
    .replace(/\D/g, '') // Retira o que não é número
    .slice(0, 11) // Limita o tamanho
    .replace(/(\d{1,2})/, '($1') // Coloca o primeiro parênteses
    .replace(/(\({1}\d{2})(.+)/, '$1) $2') // Coloca o segundo parênteses
    .replace(/(\(\d\d\)\s)(\d{4})(\d{1,4})/, '$1$2-$3') // Coloca o - no formato 8 dígitos
    .replace(/(\(\d\d\)\s)(\d{4})(-)(\d{1})(\d{4})/, '$1$2$4-$5'); // Coloca o - no formato 9 dígitos
  return value;
};

export const formatDataNascimento = (input) => {
  const value = String(input)
    .replace(/\D/g, '') // Retira o que não é número
    .slice(0, 8) // Limita o tamanho
    .replace(/(\d{2})(\d{1,})/, '$1/$2') // Coloca a primeira barra
    .replace(/(\d{2}\/\d{2})(\d{1,2})/, '$1/$2') // Coloca a segunda barra
    .replace(/(\d{2}\/\d{2}\/)(\d{1,4}) /, '$1/$2'); // Coloca a terceira barra
  return value;
};

export const formatMatricula = (input) => {
  const value = String(input)
    .replace(/\D/g, '') // Retira o que não é número
    .slice(0, 9) // Limita o tamanho
    .replace(/(\d{8})(\d{1})/, '$1-$2'); // Coloca o traço para o último dígito
  return value;
};
