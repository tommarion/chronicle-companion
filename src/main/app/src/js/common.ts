export function getBaseURL() {
    console.log(window.location.protocol + '//' + document.domain + ':' + window.location.port + '/');
    return window.location.protocol + '//' + document.domain + ':' + window.location.port + '/';
}