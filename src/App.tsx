import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { Countdown } from './components/sections/Countdown';
import { EventDetails } from './components/sections/EventDetails';
import { Faq } from './components/sections/Faq';
import { Gallery } from './components/sections/Gallery';
import { Gifts } from './components/sections/Gifts';
import { Guestbook } from './components/sections/Guestbook';
import { GuestGuide } from './components/sections/GuestGuide';
import { Hero } from './components/sections/Hero';
import { Rsvp } from './components/sections/Rsvp';
import { Story } from './components/sections/Story';
import { Welcome } from './components/sections/Welcome';

export default function App() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Welcome />
        <Countdown />
        <Story />
        <Gallery />
        <EventDetails />
        <GuestGuide />
        <Rsvp />
        <Gifts />
        <Guestbook />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
