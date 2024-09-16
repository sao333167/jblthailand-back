/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}", // for React projects
        "./public/index.html", // if you have HTML files
        "./resources/views/**/*.blade.php", // for Laravel projects
        "./components/**/*.{vue,js}", // for Vue.js projects
        // Add more paths as needed
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};

