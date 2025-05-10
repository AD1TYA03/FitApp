import { Stack } from 'expo-router';

const WorkoutLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown:false }} />
            <Stack.Screen name="[id]" options={{ headerShown:false }} />
            <Stack.Screen name="[category]" options={{ headerShown:false }} />
        </Stack>
    );
};

export default WorkoutLayout;
