import { AuthProvider } from "@/context/AuthContext";
import { Slot } from "expo-router";
import AuthFlow from "./AuthFlow";


export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthFlow />
    </AuthProvider>
  );
}
