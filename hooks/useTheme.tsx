import { useColorScheme } from 'react-native';

const useTheme = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return {
    background: isDarkMode ? '#121212' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#000000',
  };
};

export default useTheme;
