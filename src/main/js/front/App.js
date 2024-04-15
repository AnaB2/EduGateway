import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import SignupUser from "./users/SignUpUser";
import SignupInstitution from "./institutions/SignUpInstitution";
import LoginUser from "./users/LoginUser";

export default function App() {
  return (
    <View style={styles.container}>
      <LoginUser />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
