import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import SignupUser from "./users/SignUpUser";
import SignupInstitution from "./institutions/SignUpInstitution";
import LoginUser from "./users/LoginUser";
import LoginInstitution from "./institutions/LoginInstitution";

export default function App() {
  return (
    <View style={styles.container}>
      <SignupUser />
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
