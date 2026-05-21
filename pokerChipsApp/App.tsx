import React, { useState } from 'react';
import HomeScreen from './src/screens/HomeScreen';
import TableScreen from './src/screens/TableScreen';

interface TableConfig {
  players: number;
  stack: number;
}

export default function App() {
  const [tableConfig, setTableConfig] = useState<TableConfig | null>(null);

  const handleCreateTable = (players: number, stack: number) => {
    setTableConfig({ players, stack });
  };

  const handleJoinTable = (_code: string) => {
    // TODO: Connect to server and get table config
    // For now, join with a default config
    setTableConfig({ players: 6, stack: 5000 });
  };

  const handleLeaveTable = () => {
    setTableConfig(null);
  };

  if (tableConfig) {
    return (
      <TableScreen
        players={tableConfig.players}
        stack={tableConfig.stack}
        onLeaveTable={handleLeaveTable}
      />
    );
  }

  return (
    <HomeScreen
      onCreateTable={handleCreateTable}
      onJoinTable={handleJoinTable}
    />
  );
}
