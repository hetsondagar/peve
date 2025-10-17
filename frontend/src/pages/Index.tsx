// Update this page (the content is just a fallback if you fail to update the page)
import { NetworkBackground } from "@/components/NetworkBackground";

const Index = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <NetworkBackground />
      <div className="relative z-10 text-center">
        <h1 className="mb-4 text-4xl font-bold">Welcome to Your <span className="gradient-text">Blank</span> App</h1>
        <p className="text-xl text-muted-foreground">Start building your amazing project here!</p>
      </div>
    </div>
  );
};

export default Index;
