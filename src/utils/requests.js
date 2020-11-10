import axios from "axios";

const instance = axios.create({
    baseURL: 'https://www.stackadapt.com/coinmarketcap'
});

export default instance;