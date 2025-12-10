
import React from 'react';

export interface Game {
  id: string;
  name: string;
  description: string;
  // Fix: Use React.ReactElement to avoid JSX namespace issues.
  icon: React.ReactElement;
  component: React.FC;
  isAvailable: boolean;
}