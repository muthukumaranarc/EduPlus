import { useEffect, useContext } from 'react';
import { UserContext } from './context/UserContext';
import { Link } from 'react-router-dom';

function App() {
  const { username, setUsername } = useContext(UserContext);

  useEffect(() => {
    fetch("http://localhost:8080/user/get-username", {
      method: "GET",
      credentials: "include"
    })
    .then(response => response.text())
    .then(result => setUsername(result))
    .catch(error => console.log(error));
  }, [setUsername]);

  

  return (
    <>
      {
        (username === "anonymousUser") ? <div>Click Login: <Link to={"/login"}>Login</Link></div> : <p>Username: {username}</p>
      }
    </>
  )
}

export default App
