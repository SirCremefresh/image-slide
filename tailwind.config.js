/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line import/no-unused-modules
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                wiggle: {
                    '0%, 100%': {transform: 'rotate(-1deg)'},
                    '50%': {transform: 'rotate(1deg)'},
                }
            },
            animation: {
                wiggle: 'wiggle .3s ease-in-out infinite',
            }
        },
    },
    plugins: [],
}

