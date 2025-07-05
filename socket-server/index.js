const { Server } = require('socket.io');
const { createServer } = require('http');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://control-room.ai"],
    methods: ["GET", "POST"]
  }
});

async function fetchRealAgents() {
  try {
    const response = await fetch('http://localhost:3000/api/agents');
    if (response.ok) {
      const agents = await response.json();
      return agents.map(agent => ({
        id: agent.id,
        name: agent.name,
        status: agent.status || 'UNKNOWN',
        uptime: agent.uptime || 0,
        errorCount: agent.errorCount || 0,
        metrics: {
          latency: agent.metrics?.latency || 0,
          errorRate: agent.metrics?.errorRate || 0,
          cost: agent.metrics?.cost || 0,
          memory: agent.metrics?.memory || 0,
          cpu: agent.metrics?.cpu || 0
        }
      }));
    }
  } catch (error) {
    console.error('Failed to fetch real agents:', error);
  }
  return [];
}

async function generateRealtimeData() {
  const realAgents = await fetchRealAgents();
  return realAgents.map(agent => ({
    ...agent,
    metrics: {
      ...agent.metrics,
      latency: agent.metrics.latency + (Math.random() - 0.5) * 10,
      errorRate: Math.max(0, agent.metrics.errorRate + (Math.random() - 0.5) * 0.5),
      cost: agent.metrics.cost + (Math.random() - 0.5) * 2,
      memory: Math.max(0, Math.min(100, agent.metrics.memory + (Math.random() - 0.5) * 5)),
      cpu: Math.max(0, Math.min(100, agent.metrics.cpu + (Math.random() - 0.5) * 10))
    },
    lastUpdated: new Date().toISOString()
  }));
}

io.on('connection', async (socket) => {
  console.log('Client connected:', socket.id);

  socket.emit('agents:update', await generateRealtimeData());

  const interval = setInterval(async () => {
    socket.emit('agents:update', await generateRealtimeData());
  }, 5000);

  socket.on('policy:trigger', (data) => {
    console.log('Policy triggered:', data);
    io.emit('policy:triggered', {
      policyId: data.policyId,
      agentId: data.agentId,
      message: data.message,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('agent:control', async (data) => {
    console.log('Agent control command:', data);
    const { agentId, action } = data;
    
    try {
      const response = await fetch(`http://localhost:3000/api/agents/${agentId}/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      
      if (response.ok) {
        io.emit('agents:update', await generateRealtimeData());
      }
    } catch (error) {
      console.error('Failed to control agent:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    clearInterval(interval);
  });
});

const PORT = process.env.SOCKET_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
