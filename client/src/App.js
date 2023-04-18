import './static/css/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Components
import Home from "./components/home"

// Redux
import { Provider } from 'react-redux';
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Provider>
  );
}

export default App;
