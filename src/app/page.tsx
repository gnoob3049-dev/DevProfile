'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/store/app-store';
import { api } from '@/lib/api';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { LandingPage } from '@/components/pages/LandingPage';
import { RegisterPage } from '@/components/pages/RegisterPage';
import { LoginPage } from '@/components/pages/LoginPage';
import { OnboardingPage } from '@/components/pages/OnboardingPage';
import { MyProfilePage } from '@/components/pages/MyProfilePage';
import { PublicProfilePage } from '@/components/pages/PublicProfilePage';
import { ExplorePage } from '@/components/pages/ExplorePage';
import { EditProfilePage } from '@/components/pages/EditProfilePage';
import { FollowingPage } from '@/components/pages/FollowingPage';

const pages: Record<string, React.ComponentType> = {
  landing: LandingPage,
  register: RegisterPage,
  login: LoginPage,
  onboarding: OnboardingPage,
  'my-profile': MyProfilePage,
  'public-profile': PublicProfilePage,
  explore: ExplorePage,
  'edit-profile': EditProfilePage,
  following: FollowingPage,
};

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function Home() {
  const { currentPage, token } = useAppStore();

  // Validate auth on mount
  useEffect(() => {
    if (token) {
      api.getMe().catch(() => {
        useAppStore.getState().logout();
      });
    }
  }, []);

  const PageComponent = pages[currentPage] || LandingPage;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <PageComponent />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}