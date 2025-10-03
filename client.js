import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function startClient() {
  // Transport spawns the server process automatically
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['server.js'],  // Assumes server.js is in the same directory
  });

  const client = new Client({
    name: 'weather-client',
    version: '1.0.0',
  });

  try {
    // Connect (handles spawning and session setup)
    await client.connect(transport);
    console.log('Client connected to server.');

    // List available resources
    const resourcesList = await client.listResources();
    console.log('Available Resources:', resourcesList.resources.map(r => r.name).join(', '));

    // Read weather for New York (URI must be URL-encoded)
    const city = 'New York';
    const encodedCity = encodeURIComponent(city);
    const weatherUri = `weather://${encodedCity}`;
    const weatherResponse = await client.readResource({ uri: weatherUri });

    if (weatherResponse.contents && weatherResponse.contents.length > 0) {
      const weatherData = JSON.parse(weatherResponse.contents[0].text);
      console.log('Weather for', city, ':', weatherData);
    } else {
      console.log('No weather data received.');
    }
  } catch (error) {
    console.error('Client error:', error);
  } finally {
    // Clean up
    await client.close();
    console.log('Client and server shut down.');
  }
}

startClient();