import { useNavigate } from 'react-router-dom';
import './styles/Classroom.css';

export const Classroom = () => {

  const navigate = useNavigate();

  const switchPage = (e) => {
    const classroom = e.target.value;
    if(classroom != "choice") {
      window.localStorage.setItem('classroom', classroom);
      navigate('/home');
    }
  }

  return (
    <div className="screen">
      <select onClick={(e) => switchPage(e)} name="" className="select">
        <option value="choice">Scegli la classe</option>
        <option value="3c">3C</option>
        <option value="4c">4C</option>
        <option value="5c">5C</option>
      </select>
    </div>
  )

}