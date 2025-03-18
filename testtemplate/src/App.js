import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; // Assuming React Router is being used
import Header from './components/Header';
import Footer from './components/Footer';import AOS from 'aos';
import 'aos/dist/aos.css';
import RoomsSection from './components/RoomsSection'; // Import RoomsSection
import HomePage from './pages/HomePage'; 

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <Router>
      <div>
        <Header />
        <main>
          <Switch>
            {/* Define your routes here */}
            <Route path="/" exact component={HomePage} />

            <Route path="/rooms" component={RoomsSection} />
            {/* Add other routes here */}
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
