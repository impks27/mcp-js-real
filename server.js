import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new McpServer({
  name: 'weather-mcp-server',
  version: '1.0.0',
});

// Define the resource template (dynamic based on {city})
const weatherTemplate = new ResourceTemplate('weather://{city}', { list: undefined });

// Register the resource
server.registerResource(
  'weather',
  weatherTemplate,
  {
    title: 'Weather Resource',
    description: 'Get current weather conditions for a city.',
  },
  async (uri, params) => {
    try {
      const { city } = params;
      if (!city) {
        throw new Error('City parameter is required');
      }
      const weatherData = {
        city,
        temperature: 22,
        conditions: 'Sunny',
        humidity: 60,
      };
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(weatherData, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error('Error in weather handler:', error);
      throw error;
    }
  }
);

async function startServer() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log('MCP Weather Server running...');
  } catch (error) {
    console.error('Server failed to start:', error);
    process.exit(1);
  }
}

startServer();