import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFound = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 1.5rem',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: 'var(--danger-bg)',
          color: 'var(--danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}
      >
        <AlertCircle size={44} />
      </div>

      <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.03em' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.5rem 0' }}>Resource Not Found</h2>
      <p style={{ color: 'var(--text-muted)', maxWidth: '420px', marginBottom: '2rem' }}>
        The inventory route or page module you requested does not exist or has been relocated to another workspace path.
      </p>

      <Link to="/dashboard">
        <Button variant="primary" icon={ArrowLeft} size="lg">
          Back to Executive Dashboard
        </Button>
      </Link>
    </div>
  );
};
