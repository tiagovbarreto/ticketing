import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    //We are in the server

    let url = "";

    if (process.env.ENV_NAME === "dev") {
      url = "http://nginx-ingress-controller.kube-system.svc.cluster.local";
    } else {
      url = "http://www.ticketing.work/";
    }

    console.log("ENV_NAME  = ", process.env.ENV_NAME);
    console.log("URL = ", url);

    return axios.create({
      baseURL: url,
      headers: req.headers,
    });
  } else {
    //We are in the browser
    return axios.create({ baseURL: "/" });
  }
};
