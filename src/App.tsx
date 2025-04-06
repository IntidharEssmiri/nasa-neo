import React from 'react';
import Navbar from './components/Navbar';
import CardContainer from './components/CardContainer';
import './App.css';
import './styles//style.css';

function App() {
  return (

      <div className="flex-1 flex flex-col">
        <Navbar />
        <CardContainer />
      </div>
 
  );
}

export default App;
