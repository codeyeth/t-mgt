import AuthUser from "./auth/AuthUser";
import Admin from "./pages/Admin";
import Guest from "./pages/Guest";

function App() {
  const { getToken } = AuthUser();

  if (!getToken()) {
    return <Guest />;
  }
  return <Admin />;
}

export default App;
