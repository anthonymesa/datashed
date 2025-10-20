import './App.css';
import ModalActionAdd from './features/ModalActionAdd/ModalActionAdd'
import ModalActionEdit from './features/ModalActionEdit/ModalActionEdit'
import DemoModal from './features/DemoModal/DemoModal';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AuthHandler from './app/AuthHandler/AuthHandler';
import ModalLoginCaution from './features/ModalLoginCaution/ModalLoginCaution';
import SessionManager from './app/SessionManager/SessionManager';
import ModalDatastreamAdd from './features/ModalDatastreamAdd/ModalDatastreamAdd';
const router = createBrowserRouter([
  {
    path: "/",
    element: <SessionManager />,
  },
  {
    path: "/auth",
    element: <AuthHandler />,
  }
]);

function App() {
  return (
    <div>
      {/* <DemoModal /> */}
      <ModalActionAdd />
      <ModalDatastreamAdd />
      <ModalActionEdit />
      <ModalLoginCaution />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
