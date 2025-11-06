const express = require('express');
const { exec } = require('child_process');
const crypto = require('crypto');

const app = express();
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-secret-key-change-this';
const PORT = process.env.WEBHOOK_PORT || 9000;

app.use(express.json());

app.post('/webhook', (req, res) => {
	const signature = req.headers['x-hub-signature-256'];
	const payload = JSON.stringify(req.body);
	
	// Verify GitHub signature (optional but recommended)
	if (signature) {
		const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
		const digest = 'sha256=' + hmac.update(payload).digest('hex');
		
		if (signature !== digest) {
			console.error('Invalid signature');
			return res.status(401).send('Invalid signature');
		}
	}
	
	// Check if this is a push to main branch
	const ref = req.body.ref;
	if (ref !== 'refs/heads/main') {
		return res.status(200).send('Not main branch, skipping deployment');
	}
	
	// Execute deployment script
	exec('/usr/local/bin/deploy-webhook.sh', (error, stdout, stderr) => {
		if (error) {
			console.error(`Deployment error: ${error}`);
			return res.status(500).send('Deployment failed');
		}
		console.log(`Deployment output: ${stdout}`);
		if (stderr) {
			console.error(`Deployment stderr: ${stderr}`);
		}
		res.status(200).send('Deployment triggered successfully');
	});
});

app.get('/health', (req, res) => {
	res.status(200).send('Webhook server is running');
});

app.listen(PORT, () => {
	console.log(`Webhook server listening on port ${PORT}`);
});

