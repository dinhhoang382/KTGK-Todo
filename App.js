import { FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import { Appbar, Button, TextInput } from 'react-native-paper';
import { ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import Todo from './Todo';
import Toast from 'react-native-toast-message';

export default function App() {
  const ref = firestore().collection('todos');
  const [todo, setTodo] = React.useState('')
  const [loading, setLoading] = React.useState(true);
  const [todos, setTodos] = React.useState([])
  // Toast ref
  const toastRef = React.useRef(null);
  //
  async function addTodo() {
    //check input text - kiem tra nhap input
    const checkinput = todo.trim()
    if (checkinput.length == 0) {
      Toast.show({
        type: "error",
        position: 'bottom',
        bottomOffset: 100,
        text1: "Error",
        text2: "Todo cannot be empty!"
      })
      return;
    }
    //them databse
    await ref.add({
      title: todo,
      complete: false,
    });
    //thong bao toast-message add thanh cong
    Toast.show({
      type: "success",
      position: 'top',
      text1: "Success",
      text2: `${todo} added successfully!`,
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });
    //
    setTodo('');
  }
  //
  React.useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const { title, complete } = doc.data();
        list.push({
          id: doc.id,
          title,
          complete,
        });
      });
      setTodos(list);
      if (loading) {
        setLoading(false);
      }
    });
  });

  if (loading) {
    return null;
  }
  //
  //
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#eee" translucent={true} />
      <View style={{ flex: 1 }}>
        <Appbar.Header mode='center-aligned' style={{ backgroundColor: '#55c' }}>
          <Appbar.Content title={"TODOs List"} style={{ backgroundColor: '#fff', borderRadius: 20 }} />
        </Appbar.Header>
        <Text> List of TODOs! - Đinh Thế Hoàng</Text>
        <FlatList
          style={{ flex: 1 }}
          data={todos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Todo {...item} />}
          ItemSeparatorComponent={() =>
            <View style={{ height: 1, backgroundColor: '#ccc' }} />}
        />
        <View style={{ height: 60, flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 1 }}>
          <TextInput
            style={{ width: '80%', marginLeft: 2 }}
            mode='outlined'
            label={'New Todo'}
            value={todo}
            onChangeText={(text) => setTodo(text)}
            onSubmitEditing={addTodo} />
          <Button mode='text' icon="send"
            style={{ height: 50, alignSelf: 'flex-end' }}
            onPress={addTodo}>
            Add
          </Button>
        </View>
      </View>
      <Toast ref={toastRef} />
    </SafeAreaProvider>
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
