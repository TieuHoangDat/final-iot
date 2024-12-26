import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Diagram from './pages/Diagram';
import Introduce from './pages/Introduce';
import Cam from './pages/Cam';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute
import Layout from './components/Layout'; // Import Layout

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<PrivateRoute> <Layout><Dashboard /></Layout></PrivateRoute>}/>
        <Route path="/diagram" element={<PrivateRoute> <Layout><Diagram /></Layout></PrivateRoute>}/>
        <Route path="/introduce" element={<PrivateRoute> <Layout><Introduce /></Layout></PrivateRoute>}/>
        <Route path="/cam" element={<PrivateRoute> <Layout><Cam /></Layout></PrivateRoute>}/>
      </Routes>
    </Router>
  );
};

export default App;
