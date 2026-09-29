import axios from 'axios';

// const api = axios.create({baseURL: 'localhost:3000'})

const apiServer = `${(process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : 'localhost'}`;


console.log(`BASE_URL ${apiServer}`);

const client = axios.create({
  baseURL: `${apiServer}`,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
});

const urlFiles = `${apiServer}/files`;

export { client, urlFiles };
