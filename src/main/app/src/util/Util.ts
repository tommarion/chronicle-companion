export default abstract class Util {
    static readonly CAMEL_TO_TEXT = (text: string): string => {
        const result = text.replace(/([A-Z])/g, " $1");
        return result.charAt(0).toUpperCase() + result.slice(1);
    }
    static readonly TEXT_TO_CAMEL = (text: string): string => {
        return text.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    }
    static readonly GET_SEARCH_STRING_VARIABLES = () => {
        let searchStrings = window.location.search.split('&');
        try {
            return new Map<string, string>(searchStrings.map((searchString) => {
                let stringSplit = searchString.charAt(0) === '?' ? searchString.substring(1).split('=') :
                    searchString.split('=');
                if (stringSplit.length === 2) {
                    return [stringSplit[0], stringSplit[1]];
                }
            }));
        } catch (typeError) {
            return null;
        }
    }
    static readonly GET_RANDOM_COLOR = () => {
        let o = Math.round, r = Math.random, s = 255;
        return [o(r() * s), o(r() * s), o(r() * s)];
    }
}