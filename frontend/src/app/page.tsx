import Header from './components/Header';
import Footer from './components/Footer';
import UrlShortener from './components/UrlShortener';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'URL Shortener',
  description: 'Service, which can help you to reduce urls'
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <UrlShortener />
      </main>

      <Footer />
    </div>
  );
}