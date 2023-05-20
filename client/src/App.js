import './static/css/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Components
import Login from "./components/Login"
import SignUp from "./components/SignUp"

// Redux
import { Provider } from 'react-redux';
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
      </Routes>
    </Provider>
  );
}

export default App;
