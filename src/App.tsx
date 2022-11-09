import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap";
import 'react-toastify/dist/ReactToastify.css';
import './app.css';
import { MainRoutes } from './routes/routes';

axios.defaults.withCredentials = true

const App = () => {
  return (
      <MainRoutes />
  )
}

export default App