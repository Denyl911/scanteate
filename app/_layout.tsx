import { Stack } from "expo-router";
import "../assets/css/glogal.css"

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false,
    }}>
    </Stack>
  );
}
