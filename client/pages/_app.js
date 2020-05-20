import "bootstrap/dist/css/bootstrap.css";
import axiosHelper from "../helpers/axios-helper";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />;
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = axiosHelper(appContext.ctx);
  const { data } = await client.get("/api/users/current-user");

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  const result = { pageProps, currentUser: data.currentUser };

  return result;
};

export default AppComponent;
