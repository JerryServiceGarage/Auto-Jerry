import { Routes, Route } from 'react-router';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
// BOOKING DISABLED: import Book from './pages/Book';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
// BOOKING DISABLED: import Verify from './pages/Verify';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        {/* BOOKING DISABLED: <Route path="book" element={<Book />} /> */}
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        {/* BOOKING DISABLED: <Route path="verify" element={<Verify />} /> */}
      </Route>
    </Routes>
  );
}
