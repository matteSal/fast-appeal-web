import logo from './logo.svg';
import { Home } from './components/Home.js';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import { Classroom } from './components/Classroom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/home'} element={<><Home/></>}/>
        <Route path={'/'} element={<><Classroom/></>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
