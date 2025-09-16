import { useEffect, useState, useRef } from 'react';
import './App.css';
import { Button } from './components/ui/button';

const server = 8765;

type canMessage = {
  can_id: number;
  signal_name: string;
  value: number;
  timestamp: number;
};

/*
Sample can message: {can_id: 520, signal_name: 'speed', value: -2.86845397588316e+38, timestamp: 1757982974.990487}
*/

function App() {
  const [messages, setMessages] = useState<canMessage[]>([]);
  const connected = useRef(false);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:${server}`);
    if (connected.current) return;
    connected.current = true;

    ws.onopen = () => {
      console.log('Connected to Python WebSocket Server');
    };

    ws.onmessage = (event) => {
      console.log(event);
      try {
        const data: canMessage = JSON.parse(event.data); // the backend sends JSON
        console.log(data);
        setMessages((prev) => [...prev, data]);
      } catch (err) {
        console.error('Failed to parse message:', err);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };
  }, []);

  return (
    <div>
      <Button>Message</Button>
    </div>
  );
}

export default App;
