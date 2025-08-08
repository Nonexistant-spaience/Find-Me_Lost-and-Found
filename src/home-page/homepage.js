import React, { useEffect, useMemo } from 'react';
import './home.css';
import { Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { 
  Search, 
  Upload, 
  Notifications, 
  Security, 
  People, 
  TrendingUp,
  LocationOn,
  AccessTime,
  CheckCircle
} from '@mui/icons-material';

const HomePage = (props) => {
  const [text, setText] = React.useState('Discover the Lost');
  const taglineArr = useMemo(() => ['Discover the Lost', 'Connect the Found', 'Reunite with Loved Ones'], []);

  const iRef = React.useRef(0);

  useEffect(() => {
    document.body.style.background = (props.theme === 'dark' ? '#0a0a0a' : '#ffffff');
    const intervalId = setInterval(() => {
      setText(taglineArr[iRef.current]);
      iRef.current = (iRef.current + 1) % taglineArr.length;
    }, 2000);

    return () => {
      document.body.style.background = null;
      clearInterval(intervalId);
    };
  }, [taglineArr, props.theme]);

  const stats = [
    { number: '10,000+', label: 'Items Recovered', icon: <CheckCircle /> },
    { number: '5,000+', label: 'Happy Users', icon: <People /> },
    { number: '95%', label: 'Success Rate', icon: <TrendingUp /> },
    { number: '24/7', label: 'Support', icon: <AccessTime /> }
  ];

  const features = [
    {
      icon: <Search />,
      title: 'Smart Search',
      description: 'Advanced search algorithms to help you find your lost items quickly and efficiently.'
    },
    {
      icon: <Upload />,
      title: 'Easy Upload',
      description: 'Simple and intuitive interface to report lost or found items with detailed information.'
    },
    {
      icon: <Notifications />,
      title: 'Instant Alerts',
      description: 'Get notified immediately when your lost item is found or when someone reports finding it.'
    },
    {
      icon: <Security />,
      title: 'Secure Platform',
      description: 'Your data is protected with industry-standard security measures and privacy controls.'
    }
  ];

  return (
    <div className={`home-container ${props.theme === 'dark' ? 'dark' : 'light'}`}>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="highlight">Lost</span> & <span className="highlight">Found</span>
            </h1>
            <p className="hero-subtitle changing-text">{text}</p>
            <p className="hero-description">
              Connect lost items with their owners through our intelligent platform. 
              Whether you've lost something precious or found an item that needs to be returned, 
              we're here to help bring them back together.
            </p>
            <div className="hero-buttons">
              <NavLink to="/lost" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  className="primary-btn"
                  startIcon={<Search />}
                >
                  Report Lost Item
                </Button>
              </NavLink>
              <NavLink to="/found" style={{ textDecoration: 'none' }}>
                <Button
                  variant="outlined"
                  className="secondary-btn"
                  startIcon={<Upload />}
                >
                  Report Found Item
                </Button>
              </NavLink>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <LocationOn className="card-icon" />
              <span>Location Tracking</span>
            </div>
            <div className="floating-card card-2">
              <CheckCircle className="card-icon" />
              <span>Verified Matches</span>
            </div>
            <div className="floating-card card-3">
              <People className="card-icon" />
              <span>Community Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose Our Platform?</h2>
          <p>We provide comprehensive solutions for lost and found items</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of users who have successfully recovered their lost items</p>
          <div className="cta-buttons">
            <NavLink to="/items" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                className="primary-btn"
                startIcon={<Search />}
              >
                Browse Items
              </Button>
            </NavLink>
            <NavLink to="/about" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                className="secondary-btn"
              >
                Learn More
              </Button>
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
