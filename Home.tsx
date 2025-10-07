import { Link } from "react-router-dom";
import StarField from "@/components/StarField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Telescope, LineChart, Rocket, Upload, MousePointer, Eye } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen relative">
      <StarField />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-16 animate-slide-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            🌠 Welcome to the Exoplanet Classifier
          </h1>
          <p className="text-xl text-muted-foreground">
            An AI-powered tool to explore worlds beyond our solar system
          </p>
        </header>

        {/* What is this */}
        <section className="mb-16 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">What is this?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90 leading-relaxed">
                This project uses NASA's Kepler & TESS mission data with Machine Learning to classify exoplanets. 
                By analyzing stellar observations and orbital characteristics, our AI model helps identify potentially 
                habitable worlds in distant star systems.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* How it Works */}
        <section className="mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">How it Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-accent/30 hover:border-accent/60 transition-all hover:shadow-lg hover:shadow-accent/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                  <Telescope className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">🌌 Observation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Telescopes observe dips in star brightness when planets transit in front of their host stars.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-accent/30 hover:border-accent/60 transition-all hover:shadow-lg hover:shadow-accent/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                  <LineChart className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">🔬 Feature Extraction</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Features like orbital period, planet radius, and signal-to-noise ratio are extracted from light curves.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-accent/30 hover:border-accent/60 transition-all hover:shadow-lg hover:shadow-accent/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">🚀 Classification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  AI model classifies objects as Confirmed Planet, Candidate, or False Positive based on patterns.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Why is it Useful */}
        <section className="mb-16 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Card className="bg-card/50 backdrop-blur-sm border-success/20 hover:border-success/40 transition-all">
            <CardHeader>
              <CardTitle className="text-2xl text-success">Why is it Useful?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90 leading-relaxed">
                Manual discovery of exoplanets is incredibly time-consuming, requiring experts to analyze thousands 
                of light curves by hand. AI accelerates exoplanet discovery and helps scientists focus on the most 
                promising targets, enabling faster identification of potentially habitable worlds and advancing our 
                understanding of planetary systems beyond our own.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* How to Use */}
        <section className="mb-16 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">How to Use</h2>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Upload className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">1. Upload CSV Data</h3>
                    <p className="text-muted-foreground">
                      Upload a CSV file containing star observation data with features like orbital period, 
                      planet radius, and signal-to-noise ratio.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <MousePointer className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">2. Click "Classify Exoplanets"</h3>
                    <p className="text-muted-foreground">
                      Run the AI model to analyze your data and generate predictions for each observation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">3. View Results</h3>
                    <p className="text-muted-foreground">
                      Review predictions with confidence scores and visualize the distribution of classifications.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Visuals */}
        <section className="mb-16 animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">Understanding Exoplanet Detection</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 overflow-hidden">
              <CardHeader>
                <CardTitle>Space Telescope</CardTitle>
                <CardDescription>Advanced instruments observe distant stars</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                  <Telescope className="w-24 h-24 text-primary/40" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 overflow-hidden">
              <CardHeader>
                <CardTitle>Transit Light Curve</CardTitle>
                <CardDescription>Brightness dip indicates planet transit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                  <LineChart className="w-24 h-24 text-primary/40" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mb-16 animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/30 p-8">
            <div className="space-y-6">
              <div className="text-4xl">✅</div>
              <h2 className="text-2xl font-bold text-primary">Ready to Discover Exoplanets?</h2>
              <p className="text-foreground/90 max-w-2xl mx-auto">
                Head to the Classifier page to try it yourself! Upload your star data and let AI 
                help you identify potential worlds orbiting distant stars.
              </p>
              <Link to="/classifier">
                <Button variant="cosmic" size="lg" className="text-lg px-8 py-6 h-auto">
                  Go to Classifier →
                </Button>
              </Link>
            </div>
          </Card>
        </section>

        {/* Footer */}
        <footer className="text-center text-muted-foreground text-sm pb-8">
          <p>Powered by NASA Kepler/TESS data and AI/ML</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
