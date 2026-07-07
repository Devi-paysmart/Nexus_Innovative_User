import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DarkModeProvider } from "./context/DarkModeContext";
import { CartProvider } from "./context/CartContext";
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
import { CartPage } from "./pages/CartPage";
import { ProfilePage } from "./pages/ProfilePage";
import { QuotationPDFPage } from "./pages/QuotationPDFPage";
import AuthPage from "./pages/AuthPage";
import RegisterPage from "./pages/RegisterPage";

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
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </AnimatePresence>
  );
}

import { CategoriesProvider } from "./context/CategoriesContext";

function App() {
  return (
    <DarkModeProvider>
      <CategoriesProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/quotation/:id" element={<QuotationPDFPage />} />
              <Route path="/signin" element={<AuthPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/signup" element={<RegisterPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/*"
                element={
                  <MainLayout>
                    <AnimatedRoutes />
                  </MainLayout>
                }
              />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </CategoriesProvider>
    </DarkModeProvider>
  );
}

export default App;
