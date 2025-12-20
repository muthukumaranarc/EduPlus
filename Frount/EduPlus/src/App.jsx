import { useContext, useEffect } from 'react';
import { UserContext } from "./context/UserContext";
import { useNavigate } from 'react-router-dom';

function App() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading == false) {
      if (user?.username) {
        navigate('/home', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [user, navigate, loading]);

  return null; // or a loader
}

export default App;
