/**
 * FIXME: WHAT THE HELL IS THIS?
 * please do not use this Pipe, it's over engineering.
 * Search its use it the code and replace with a normal ES6 string: `url(${variable})`
 */
export class ImgUrlToCssUrl {
    formatToCss(imgUrl) {
        return 'url(' + imgUrl + ')';
    }
}
