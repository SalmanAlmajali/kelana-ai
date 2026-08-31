import BackgroundOverlay from "@/components/BackgroundOverlay";
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BackgroundOverlay />
      <div className="relative z-10 flex min-h-screen flex-col">
        <NavigationHeader />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
