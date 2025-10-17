import { useNavigate } from "react-router-dom";
import { DatabaseHeroCarousel } from "@/components/DatabaseHeroCarousel";
import { SEOHead } from "@/components/SEOHead";

const Index = () => {
  const navigate = useNavigate();
  return (
    <>
      <SEOHead page="home" />
      <main>
        <DatabaseHeroCarousel onNavigate={(path) => navigate(`/${path}`)} />
      </main>
    </>
  );
};

export default Index;
