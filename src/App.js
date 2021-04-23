
import './App.css';
import Home from './components/Home.js'

const URL = 'http://localhost/Ropet/';

function App() {
  return (
    <div className='container-fluid'>
      <Home URL={URL}/>
    </div>
  );
}

export default App;
