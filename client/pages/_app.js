import "bootstrap/dist/css/bootstrap.css";
import axiosHelper from "../helpers/axios-helper";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = axiosHelper(appContext.ctx);
  const { data } = await client.get("/api/users/current-user");

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  const result = { pageProps, currentUser: data.currentUser };

  return result;
};

export default AppComponent;
