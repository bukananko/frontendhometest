import { Navbar } from '@/components/Navbar';
import HeroSection from '@/components/user/HeroSection';
import ArticlesSection from '@/components/user/ArticlesSection';
import { Suspense } from 'react';

const HomePage = async () => {
  return (
    <>
      <Navbar variant='transparent' />
      <main>
        <HeroSection />
        <Suspense fallback={<div>Loading...</div>}>
          <ArticlesSection />
        </Suspense>
      </main>
    </>
  );
};

export default HomePage;
