export function extractQueryParams(query = '') {
    if (!query) return {};

    // aceita tanto "?a=1&b=2" quanto "a=1&b=2"
    const qs = query.startsWith('?') ? query.slice(1) : query;
    if (!qs) return {};

    return qs.split('&').filter(Boolean).reduce((acc, param) => {
        const [key, value = ''] = param.split('=');
        try {
            acc[decodeURIComponent(key)] = decodeURIComponent(value);
        } catch {
            acc[key] = value;
        }
        return acc;
    }, {});
}