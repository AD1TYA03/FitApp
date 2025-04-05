import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Feather name="message-circle" size={size} color={color} />,
          tabBarLabel: 'Chat',
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Feather name="bar-chart-2" size={size} color={color} />,
          tabBarLabel: 'Leaderboard',
        }}
      />
      <Tabs.Screen
        name="run"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Feather name="activity" size={size} color={color} />,
          tabBarLabel: 'Run',
        }}
      />
    </Tabs>
  );
}
