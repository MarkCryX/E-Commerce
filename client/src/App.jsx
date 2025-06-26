
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <AppRoutes/>
      <ToastContainer  position="bottom-right" autoClose={2000} /> 
    </>
  );
}

export default App;
