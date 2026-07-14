import { Link } from 'react-router-dom';
import { Button } from '@components/ui/button';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <h1 className="error-code">404</h1>
          <h2>Page Not Found</h2>
          <p>Sorry, the page you're looking for doesn't exist or has been moved.</p>
          <div className="not-found-actions">
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary">Go to Dashboard</Button>
            </Link>
          </div>
        </div>
        <div className="not-found-illustration">
          <svg viewBox="0 0 200 200" width="200" height="200">
            <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="2" />
            <text x="100" y="110" textAnchor="middle" fontSize="60" fontWeight="bold" fill="currentColor">
              ?
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
