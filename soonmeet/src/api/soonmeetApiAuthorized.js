import axios from 'axios';

export default authToken => axios.create({
  baseURL: '127.0.0.1/api', // AWS URL used to be here
  headers: {
    Authorization: 'Token ' + authToken
  }
});
