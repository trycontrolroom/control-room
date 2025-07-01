const { Server } = require('socket.io');
const { createServer } = require('http');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://control-room.ai"],
    methods: ["GET", "POST"]
  }
});

const mockAgents = [
  {
    id: 'agent-alpha',
    name: 'Agent Alpha',
    status: 'ACTIVE',
    uptime: 99.5,
    errorCount: 2,
    metrics: {
      latency: 45,
      errorRate: 0.1,
      cost: 12.50,
      memory: 85,
      cpu: 23
    }
  },
  {
    id: 'agent-bravo',
    name: 'Agent Bravo',
    status: 'PAUSED',
    uptime: 87.3,
    errorCount: 15,
    metrics: {
      latency: 120,
      errorRate: 2.3,
      cost: 18.75,
      memory: 92,
      cpu: 67
    }
  }
];

function generateRealtimeData() {
  return mockAgents.map(agent => ({
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

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.emit('agents:update', generateRealtimeData());

  const interval = setInterval(() => {
    socket.emit('agents:update', generateRealtimeData());
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

  socket.on('agent:control', (data) => {
    console.log('Agent control command:', data);
    const { agentId, action } = data;
    
    const agent = mockAgents.find(a => a.id === agentId);
    if (agent) {
      switch (action) {
        case 'pause':
          agent.status = 'PAUSED';
          break;
        case 'resume':
          agent.status = 'ACTIVE';
          break;
        case 'stop':
          agent.status = 'STOPPED';
          break;
      }
      
      io.emit('agents:update', generateRealtimeData());
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
