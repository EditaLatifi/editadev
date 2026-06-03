import { renderToStaticMarkup } from "react-dom/server";
import App from "./App.jsx";

// Rendered at build time to bake the full page content into dist/index.html
// (so crawlers and link unfurlers get real HTML, not an empty SPA shell).
export function render() {
  return renderToStaticMarkup(<App />);
}
