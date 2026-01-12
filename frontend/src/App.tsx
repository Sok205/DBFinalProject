import { Component, createSignal, Show } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import Dashboard from './pages/Dashboard';
import PartDetails from './pages/PartDetails';
import CarView from './pages/CarView';
import IntroAnimation from './components/IntroAnimation';

const App: Component = () => {
  const [showIntro, setShowIntro] = createSignal(true);

  return (
    <>
      <Show when={showIntro()}>
        <IntroAnimation onComplete={() => setShowIntro(false)} />
      </Show>

      {/* App content loads in background while intro plays */}
      <Router>
        <Route path="/" component={Dashboard} />
        <Route path="/parts/:id" component={PartDetails} />
        <Route path="/cars/:id" component={CarView} />
      </Router>
    </>
  );
};

export default App;
