
import './App.css';
import Home from './components/Home.js'

const URL = 'http://localhost/ropet_backend/';

function App() {
  return (
    <div className='container-fluid'>
      <Home URL={URL}/>
    </div>
  );
}

export default App;
