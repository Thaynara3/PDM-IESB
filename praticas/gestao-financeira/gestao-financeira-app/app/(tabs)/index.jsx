import { useContext, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { MoneyContext } from "../../src/contexts/GlobalState";
import { AuthContext } from "../../src/contexts/AuthContext";
import { api } from "../../src/services/api";

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default function Transactions() {
  const { transactions, loadData } = useContext(MoneyContext);
  const { user, logout } = useContext(AuthContext);

  const [mesAtual, setMesAtual] = useState(new Date().getMonth());
  const [modalVisible, setModalVisible] = useState(false);
  const [transacaoEmEdicao, setTransacaoEmEdicao] = useState(null);

  const transacoesFiltradas = transactions.filter(
    (t) => new Date(t.date).getMonth() === mesAtual
  );

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/login");
        },
      },
    ]);
  };

  const handleLongPress = (item) => {
    Alert.alert("Gerenciar", "O que deseja fazer?", [
      {
        text: "Editar",
        onPress: () => {
          setTransacaoEmEdicao({
            ...item,
            value: String(item.value),
          });
          setModalVisible(true);
        },
      },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await api.deleteTransaction(item.id);
          loadData();
        },
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const salvarEdicao = async () => {
    if (!transacaoEmEdicao) return;

    try {
      await api.updateTransaction(transacaoEmEdicao.id, {
        description: transacaoEmEdicao.description,
        value: Number(String(transacaoEmEdicao.value).replace(",", ".")),
      });

      setModalVisible(false);
      setTransacaoEmEdicao(null);
      loadData();

      Alert.alert("Sucesso", "Transação atualizada!");
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Olá, {user?.name || "usuário"}!</Text>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={24} color="#DA5567" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filtrar Mês:</Text>

        <Picker
          style={styles.picker}
          selectedValue={mesAtual}
          onValueChange={(itemValue) => setMesAtual(itemValue)}
        >
          {MESES.map((mes, index) => (
            <Picker.Item key={index} label={mes} value={index} />
          ))}
        </Picker>
      </View>

      <FlatList
        data={transacoesFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isIncome = item.category?.isIncome;

          return (
            <TouchableOpacity
              onLongPress={() => handleLongPress(item)}
              style={styles.item}
            >
              <View>
                <Text style={styles.desc}>{item.description}</Text>
                <Text style={styles.date}>
                  {new Date(item.date).toLocaleDateString("pt-BR")}
                </Text>
              </View>

              <Text
                style={[
                  styles.value,
                  { color: isIncome ? "#37BF81" : "#DA5567" },
                ]}
              >
                {Number(item.value).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>Sem transações neste mês.</Text>
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Transação</Text>

            <TextInput
              style={styles.input}
              value={transacaoEmEdicao?.description || ""}
              onChangeText={(text) =>
                setTransacaoEmEdicao({
                  ...transacaoEmEdicao,
                  description: text,
                })
              }
            />

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={transacaoEmEdicao?.value || ""}
              onChangeText={(text) =>
                setTransacaoEmEdicao({
                  ...transacaoEmEdicao,
                  value: text,
                })
              }
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setTransacaoEmEdicao(null);
                }}
                style={[styles.button, { backgroundColor: "#ccc" }]}
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={salvarEdicao} style={styles.button}>
                <Text style={{ color: "#fff" }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  welcome: {
    fontSize: 20,
    fontWeight: "bold",
  },
  logoutButton: {
    padding: 5,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  filterLabel: {
    paddingLeft: 10,
    fontWeight: "bold",
  },
  picker: {
    flex: 1,
  },
  item: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  desc: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 12,
    borderRadius: 5,
    backgroundColor: "#37BF81",
    flex: 0.48,
    alignItems: "center",
  },
});