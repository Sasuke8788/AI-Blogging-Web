import React from 'react';
import { StaticRouter } from 'react-router-dom/server';
import App from '../client/src/App'; // Adjust if path is different

const ServerApp = ({ url }) => (
  <StaticRouter location={url}>
    <App />
  </StaticRouter>
);

export default ServerApp;
