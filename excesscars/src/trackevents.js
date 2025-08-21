// src/utils/analytics.js
import ReactGA from "react-ga4";

export const trackEvent = ({ action, category, label, value }) => {
  ReactGA.event({
    action,
    category,
    label,
    value,
  });
};
