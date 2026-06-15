# Geometry Viewer

A modular, lightweight 3D geometry visualizer built with Vanilla JS and HTML5 Canvas. This project demonstrates various mathematical surfaces, polyhedra, and complex topological objects through interactive projections.

## Project Structure

### Root Files
- `index.html`: The main entry point. Displays the hierarchical gallery of all available geometric shapes.
- `viewer.html`: The interactive visualizer page. Handles 3D-to-2D projection, rotation, and displays mathematical context/formulas.

### CSS (`/css`)
- `base.css`: Global styles, typography, and core CSS variables (theming).
- `gallery.css`: Layout and styling specifically for the gallery index page.
- `viewer.css`: Styling for the visualizer interface, including the UI overlay, info panels, and KaTeX formula rendering.

### JavaScript (`/js`)
- `gallery.js`: Orchestrates the rendering of the gallery. It maps the hierarchical data from the `shapes` module into the DOM.
- `geometry.js`: A central export bridge for all geometric data and category definitions.
- `renderer.js`: The core graphics engine. Performs 3D vertex projection to 2D screen coordinates and handles Canvas rendering with depth sorting (painter's algorithm).
- `utils.js`: Mathematical utility functions, including vector normalization and a generic parametric surface generator.
- `viewer.js`: The main controller for the individual shape viewer. Manages the animation loop, mouse/touch interactions for rotation, and UI state.

### Geometric Shapes (`/js/shapes`)
- `index.js`: The central registry. Defines the hierarchical categorization (Disciplines -> Groups) used by the gallery and aggregates all shape definitions.
- `polyhedra.js`: Data and generators for discrete solids, including Platonic solids and truncated structures (e.g., Buckyball).
- `surfaces.js`: Generators for continuous mathematical surfaces such as spheres, tori, and non-orientable manifolds like the Klein Bottle.
- `complex.js`: Definitions for advanced objects, including fractals (Lorenz Attractor), biological models (DNA), and 4D projections (Tesseract).

## Key Features
- **Custom Projection Engine**: 3D to 2D perspective projection implemented from scratch.
- **Parametric Generation**: Flexible helper functions for generating complex surfaces from mathematical equations.
- **Interactive UI**: Drag-to-rotate interaction and smooth auto-rotation.
- **Mathematical Context**: Integrated KaTeX support for rendering the underlying formulas of each shape.
