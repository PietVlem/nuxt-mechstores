const toRem = px => `${px / 16}rem`;

module.exports = {
    mode: "jit",
    content: [
        "./assets/**/*.pcss",
        "./components/!*.{vue,js}",
        "./components/!**!/!*.{vue,js}",
        "./pages/!*.vue",
        "./pages/!**!/!*.vue",
        "./plugins/!**/!*.{js,ts}",
        "./!*.{vue,js,ts}",
    ],
    theme: {
        extend: {
            maxWidth: {
                'constraint-nm': toRem(1024),
                'constraint-lg': toRem(1440),
                'constraint-xl': toRem(1920)
            },
            fontFamily: {
                sans: [
                    'Poppins',
                    'sans-serif'
                ],
            },
            fontSize: {
                '14': toRem(14)
            },
            transitionDuration: {
                '250': '250ms'
            },
            colors: {
                black: '#282a36',
                gray: '#44475a',
                white: '#f8f8f2',
                blue: '#6272a4',
                cyan: '#8be9fd',
                green: '#50fa7b',
                orange: '#ffb86c',
                pink: '#ff79c6',
                purple: '#bd93f9',
                red: '#ff5555',
                yellow: '#f8fa8c',
            },
        },
        screens: {
            'smd': {'max': toRem(576)},
            'sm': toRem(576),
            'mdd': {'max': toRem(767)},
            'md': toRem(768),
            'nm': toRem(1024),
            'lg': toRem(1440),
            'xl': toRem(1920)
        },
    },
    plugins: [],
}