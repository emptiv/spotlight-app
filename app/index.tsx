import { Image, Text, View } from "react-native";
import { styles } from "../styles/auth.styles";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello</Text>
      
      <Image source={{uri: "https://images.unsplash.com/photo-1748228885250-49564b614db9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}} 
        style={{width: 100, height: 100}}/>

    </View>
  );
}