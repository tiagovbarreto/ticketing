import { useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const Signout = () => {
  const signoutRequest = {
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSucess: () => Router.push("/"),
  };

  const { doRequest } = useRequest(signoutRequest);

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out ...</div>;
};

export default Signout;
