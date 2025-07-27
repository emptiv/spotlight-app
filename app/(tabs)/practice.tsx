import Colors from "@/constants/Colors";
import { playSound } from '@/constants/playClickSound';
import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";


const CHARACTERS = [
  { symbol: "ᜀ", label: "A", value: "a" },
  { symbol: "ᜁ", label: "E/I", value: "e_i" },
  { symbol: "ᜂ", label: "O/U", value: "o_u" },

  { symbol: "ᜉ", label: "PA", value: "pa" },
  { symbol: "ᜃ", label: "KA", value: "ka" },
  { symbol: "ᜈ", label: "NA", value: "na" },

  { symbol: "ᜑ", label: "HA", value: "ha" },
  { symbol: "ᜊ", label: "BA", value: "ba" },
  { symbol: "ᜄ", label: "GA", value: "ga" },

  { symbol: "ᜐ", label: "SA", value: "sa" },
  { symbol: "ᜇ", label: "DA/RA", value: "da_ra" },
  { symbol: "ᜆ", label: "TA", value: "ta" },

  { symbol: "ᜅ", label: "NGA", value: "nga" },
  { symbol: "ᜏ", label: "WA", value: "wa" },
  { symbol: "ᜎ", label: "LA", value: "la" },

  { symbol: "ᜋ", label: "MA", value: "ma" },
  { symbol: "ᜌ", label: "YA", value: "ya" }
];

export default function Practice() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <FlatList
        data={CHARACTERS}
        numColumns={2}
        keyExtractor={(item) => item.value}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tile}
            onPress={async () => {
              await playSound('click');
              router.push({ pathname: "/practice/[char]", params: { char: item.value } });
            }}
          >
            <Text style={styles.character}>{item.symbol}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    padding: 16,
    paddingBottom: 65
  },
  grid: {
    justifyContent: "space-between",
  },
  tile: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    margin: 8,
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 24,
  },
  character: {
    fontSize: 80,
    color: Colors.PRIMARY,
    fontFamily: "outfit-bold",
  },
  label: {
    fontSize: 18,
    color: Colors.BLACK,
    fontFamily: "outfit",
    marginTop: 8,
  },
});
