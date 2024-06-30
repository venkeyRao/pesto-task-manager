import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import Header from "../components/Header";
import "../css/dashboard.css"; 

export default function DefaultLayout() {
  const { user, token, setUser, setToken } = useStateContext();
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  const onLogout = () => {
    setUser("");
    setToken(null);
  };

  return (
    <div id="defaultLayout">
        <Header user={user} onLogout={onLogout} />
        <div className="content">
          <main>
            <Outlet />
          </main>
        </div>
    </div>
  );
}
