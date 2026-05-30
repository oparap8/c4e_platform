// Frappe development server is running on http://127.0.0.1:8000
const frappeTargetPort = 8000;

const router = (req) => {
	const hostHeader = req.headers.host || ''; 
	const siteName = hostHeader.split(':')[0]; 

	const targetUrl = `http://${siteName}:${frappeTargetPort}`;
	console.log(`[Proxy] Routing API request for host ${req.headers.host} to ${targetUrl}${req.url}`);
	return targetUrl;
};

export default {
	// FIX: Use Vite-compatible regex syntax (wrapped in regex slashes)
	'^/(app|api|assets|files|private)': {
		target: `http://127.0.0.1:${frappeTargetPort}`,
		ws: true,
		changeOrigin: true,
		xfwd: true, // Recommended to preserve upstream headers securely
		router: router,
	}
};
