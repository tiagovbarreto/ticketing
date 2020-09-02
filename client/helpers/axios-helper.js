import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    //We are in the server
    return axios.create({
      //baseURL: "http://nginx-ingress-controller.kube-system.svc.cluster.local",
      baseURL: "http://www.ticketing.host/",
      headers: req.headers,
    });
  } else {
    //We are in the browser
    return axios.create({ baseURL: "/" });
  }
};
