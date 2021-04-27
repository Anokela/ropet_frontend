
import './App.css';
import Home from './components/Home.js'
import Footer from './components/Footer.js'

const URL = 'http://localhost/ropet_backend/';

function App() {
  return (
    <div className='container'>
      <Home URL={URL}/>
      <Footer/>
    </div>
  );
}

export default App;
