export async function json(req, res) {
    const buffers = [];
    for await (const chunk of req) {
        buffers.push(chunk);
    }

    try {
        const bodyString = Buffer.concat(buffers).toString();
        req.body = bodyString ? JSON.parse(bodyString) : undefined;
    } catch {
        req.body = null;
    }

    res.setHeader('Content-Type', 'application/json');
}