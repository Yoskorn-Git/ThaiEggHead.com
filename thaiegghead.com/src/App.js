import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from './pages/Login';
import Navbar from './component/Navbar';

function App() {
  return (
    <>
      {/* <Header/> */}
      <Navbar/>

      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          {/* <Route path="/dashboard">
            <Dashboard />
          </Route> */}
        </Switch>
      </Router>
    </>
  );
}

export default App;
