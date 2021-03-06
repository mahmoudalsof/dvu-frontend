const setUpAxios = (axios) => {
  axios.interceptors.request.use((config) => {
    config.baseUrl = process.env.REACT_APP_API_URL;
    config.url = `${config.baseUrl}${config.url}`;

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

export default setUpAxios;
