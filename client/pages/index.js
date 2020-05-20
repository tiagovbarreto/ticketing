import axiosHelper from "../helpers/axios-helper";

const IndexPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

IndexPage.getInitialProps = async (context) => {
  const client = axiosHelper(context);
  const { data } = await client.get("/api/users/current-user");

  return data;
};

export default IndexPage;
