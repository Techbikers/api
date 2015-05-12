import Routes from './routes.jsx';
import { create as createRouter, HistoryLocation } from 'react-router';

export default createRouter({
  routes: Routes,
  location: HistoryLocation
});