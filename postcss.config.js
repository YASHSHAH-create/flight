module.exports = {
    plugins: {
        '@tailwindcss/postcss': {
            // Only process Tailwind directives, not third-party CSS
            content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
        },
        autoprefixer: {},
    },
}
