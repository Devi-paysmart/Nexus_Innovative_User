import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DarkModeProvider } from "./context/DarkModeContext";
import { MainLayout } from "./components/layout/MainLayout";
import { PageTransition } from "./components/common/PageTransition";
import { HeroSection } from "./components/sections/HeroSection";
import { CategoryGrid } from "./components/sections/CategoryGrid";
import { ClientLogos, BudgetCTA } from "./components/sections/ClientLogos";
import { TestimonialPreview } from "./components/sections/TestimonialPreview";
import { ProcessPreview, NewsletterCTA } from "./components/sections/ProcessPreview";
import { CollectionsPage } from "./pages/CollectionsPage";
import { CategoryGalleryPage } from "./pages/CategoryGalleryPage";
import { CustomizationPage } from "./pages/CustomizationPage";
import { LoyaltyPage } from "./pages/LoyaltyPage";
import { HowWeWorkPage } from "./pages/HowWeWorkPage";
import { AboutPage } from "./pages/AboutPage";
import { TestimonialsPage } from "./pages/TestimonialsPage";
import { ContactPage } from "./pages/ContactPage";
import { CareersPage } from "./pages/CareersPage";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function Home() {
  return (
    <>
      <HeroSection />
      <ClientLogos />
      <CategoryGrid />
      <BudgetCTA />
      <ProcessPreview />
      <TestimonialPreview />
      <NewsletterCTA />
    </>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/collections/:category" element={<CategoryGalleryPage />} />
        <Route path="/customization" element={<CustomizationPage />} />
        <Route path="/loyalty" element={<LoyaltyPage />} />
        <Route path="/how-we-work" element={<HowWeWorkPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/careers" element={<CareersPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <MainLayout>
          <AnimatedRoutes />
        </MainLayout>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
