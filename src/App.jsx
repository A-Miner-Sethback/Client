import React from 'react';
import './App.css';
import Login from './components/Login'
// import Home from './components/home'
import { Route } from 'react-router-dom'

function App() {
    return (
        <div>
            <Route path='/login' component={Login} />
            {/* <Route exact path='/' component={Home} /> */}
        </div> 
    );
}

export default App;
