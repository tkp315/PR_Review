import ngrok from 'ngrok';

(async () => {
  try {
    // Start ngrok on the desired port (e.g., 3000)
    const url = await ngrok.connect(3000); 
    console.log(`ngrok tunnel created: ${url}`);

    // Use the URL for your webhook
    console.log(`Webhook URL: ${url}/api/github-webhook`);
    
    // Keep ngrok running
    // You may want to add more logic here based on your needs
  } catch (error) {
    console.error('Error starting ngrok:', error);
  }
})();
