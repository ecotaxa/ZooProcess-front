import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "http://zooprocess.imev-mer.fr:8081/v1",
    timeout: 5000,
});

export default axiosInstance;
