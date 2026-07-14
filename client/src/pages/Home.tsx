import { Link } from 'react-router-dom';
import { Button } from '@components/ui/button';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to AI StudyMate</h1>
          <p>Transform your learning experience with AI-powered study tools</p>
          <div className="hero-buttons">
            <Link to="/auth/register">
              <Button>Get Started</Button>
            </Link>
            <Link to="/auth/login">
              <Button variant="secondary">Sign In</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>📚 Smart Flashcards</h3>
            <p>AI-generated flashcards to reinforce your learning</p>
          </div>
          <div className="feature-card">
            <h3>🎯 Interactive Quiz</h3>
            <p>Test your knowledge with intelligent quizzes</p>
          </div>
          <div className="feature-card">
            <h3>📊 PDF Analysis</h3>
            <p>Extract insights from your study materials</p>
          </div>
          <div className="feature-card">
            <h3>🗺️ Learning Roadmap</h3>
            <p>Personalized learning paths tailored to your goals</p>
          </div>
          <div className="feature-card">
            <h3>💬 AI Chat</h3>
            <p>Get instant answers and explanations</p>
          </div>
          <div className="feature-card">
            <h3>🚀 Progress Tracking</h3>
            <p>Monitor your learning journey in real-time</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Elevate Your Study Game?</h2>
        <p>Join thousands of students using AI StudyMate</p>
        <Link to="/auth/register">
          <Button className="btn-large">Start Free Trial</Button>
        </Link>
      </section>
    </div>
  );
};

export default Home;
