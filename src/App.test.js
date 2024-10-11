import { render, screen } from '@testing-library/react';
import App from './App';

test('renders App.js', () => {
  render(<App />);
  const linkElement = screen.getByText(/Contents/i);
  expect(linkElement).toBeInTheDocument();
});
