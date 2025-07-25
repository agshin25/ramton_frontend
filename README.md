# Ramton CRM

Ramton CRM is a modern customer relationship management system built with React and styled using Tailwind CSS. It provides a comprehensive solution for managing orders, customers, and business operations with a beautiful, responsive interface.

## Features

- 🏢 Complete CRM system for business management
- 📦 Order management and tracking
- 👥 Customer relationship management
- 📊 Real-time analytics and reporting
- 🤖 Bot integration for automated messaging
- 📱 Responsive design for all devices
- ⚛️ React 18 with modern hooks
- 🎨 Tailwind CSS for styling
- 🚀 Fast development with hot reload
- 🧪 Testing setup with Jest and React Testing Library
- 📊 Web vitals monitoring

## Getting Started

### Prerequisites

Make sure you have Node.js installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
├── public/
│   ├── index.html          # Main HTML file
│   ├── manifest.json       # Web app manifest
│   └── robots.txt          # SEO robots file
├── src/
│   ├── App.js              # Main App component
│   ├── index.js            # Application entry point
│   ├── index.css           # Global styles with Tailwind
│   ├── logo.svg            # React logo
│   ├── reportWebVitals.js  # Performance monitoring
│   ├── setupTests.js       # Test configuration
│   └── App.test.js         # App component tests
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── README.md               # This file
```

## Tailwind CSS

This project uses Tailwind CSS for styling. The configuration is in `tailwind.config.js` and the main styles are imported in `src/index.css`.

### Customization

You can customize Tailwind by modifying `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      // Add your custom theme extensions here
    },
  },
  plugins: [],
}
```

## Learn More

- [React Documentation](https://reactjs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Create React App Documentation](https://facebook.github.io/create-react-app/)

## Deployment

To build the app for production:

```bash
npm run build
```

This creates a `build` folder with optimized production files that you can deploy to any static hosting service.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE). 