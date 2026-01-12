import { Component, createSignal, Show } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import Dashboard from './pages/Dashboard';
import PartDetails from './pages/PartDetails';
import PartsPage from './pages/PartsPage';
import CarView from './pages/CarView';
import CarsPage from './pages/CarsPage';
import IntroAnimation from './components/IntroAnimation';
import MainLayout from './layouts/MainLayout';

// App.tsx
// Using MainLayout to wrap authenticated routes

const App: Component = () => {
  const [showIntro, setShowIntro] = createSignal(true);

  return (
    <>
      <Show when={showIntro()}>
        <IntroAnimation onComplete={() => setShowIntro(false)} />
      </Show>

      {/* App content loads in background while intro plays */}
      <Router>
        <Route
          path="*"
          component={(props) => (
            <MainLayout>
              {props.children}
            </MainLayout>
          )}
        >
          <Route path="/" component={Dashboard} />
          <Route path="/parts" component={PartsPage} />
          <Route path="/parts/:id" component={PartDetails} />
          <Route path="/cars" component={CarsPage} />
          <Route path="/cars/:id" component={CarView} />
        </Route>
      </Router>
    </>
  );
};

export default App;
