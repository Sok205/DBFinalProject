import { Component } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import Dashboard from './pages/Dashboard';
import PartDetails from './pages/PartDetails';
import CarView from './pages/CarView';

const App: Component = () => {
  return (
    <Router>
      <Route path="/" component={Dashboard} />
      <Route path="/parts/:id" component={PartDetails} />
      <Route path="/cars/:id" component={CarView} />
    </Router>
  );
};

export default App;
