import { createStitches } from "@stitches/react";

export const { styled, globalCss, theme, css } = createStitches({
    theme: {
        colors: {
            white: '#ffffff',
            black: '#000000',
            red: '#FF0000',
            blue: '#1AB2F3',
            grayMain: '#292929',
            grayLight: '#5F5757',
            grayBgLight: '#3C3A3A',
        },
        fonts: {
            title: 'Italiana',
            text: 'Arial'
        },
}})

export const globalStyles = globalCss({
    '*': {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box'
    },
    html: {
        height: '100%',
    },
    body: {
        '-webkit-font-smoothing': 'antialiased',
        fontFamily: '$text',
        width: '100vw',
        height: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',
    }
})