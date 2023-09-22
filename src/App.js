import React, {useState ,useCallback, useEffect} from "react";
import { Dimensions, StatusBar, Button, Alert } from "react-native";
import styled, {ThemeProvider} from 'styled-components/native';
import { theme } from "./theme";
import Input from "./components/Input";
import Task from "./components/Task";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from 'expo-splash-screen';
import MyButton from "./components/MyButton";


//로딩 시작
SplashScreen.preventAutoHideAsync();

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: ${({theme}) => theme.background};
    align-items: center;
    justify-content: flex-start;
`;

const Title = styled.Text`
    font-size: 40px;
    font-weight: 600;
    color: ${({theme})=> theme.main};
    align-self: center;
    margin: 20px;
`;

    const List = styled.ScrollView`
        flex: 1;
        width: ${({width})=> width - 40}px;
    `;


export default function App() {
    const width = Dimensions.get('window').width;
    const [appIsReady, setAppIsReady] = useState(false);
    const [newTask, setNewTask] = useState('');
    const [tasks, setTasks] = useState({});
    //로딩, (AsyncStorage)호출
    const loadTask = async () => {
         try {
           const loadedTasks = await AsyncStorage.getItem('tasks');
           setTasks(JSON.parse(loadedTasks || '{}')); // json포맷의 문자자열 => js obj
         } catch (error) {
           console.log(error.message);
         }
       };
    //로딩상태에 따른 출력 여부
    useEffect(() => {
        async function prepare() {
          try {
            await loadTask();
          } catch (e) {
            console.warn(e);
          } finally {
            setAppIsReady(true);
          }
        }
    
        prepare();
      }, []);
      //로딩성공시 (SplashScreen)숨김
      const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
          await SplashScreen.hideAsync();
        }
      }, [appIsReady]);
    
      if (!appIsReady) {
        return null;
      }
    //로컬에 저장 (AsyncStorage)
    const _saveTasks = async tasks => {
        try{
            await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
            setTasks(tasks);
        } catch(e){
            console.error(e);
        }
    };
    //추가
    const _addTask = () => {
        const ID = Date.now().toString();
        const newTaskObject = {
            [ID]: {id:ID, text: newTask, completed:false},
        };
        setNewTask('');
        _saveTasks({...tasks, ...newTaskObject});
    };
    // 삭제
    const _deleteTask = id =>{
        const currentTasks = Object.assign({}, tasks);
                delete currentTasks[id];
                _saveTasks(currentTasks);
    };
   //맨앞 체크박스 변화
    const _toggleTask = id =>{
        const currentTasks = Object.assign({}, tasks);
        currentTasks[id]['completed'] = !currentTasks[id]['completed'];
        _saveTasks(currentTasks);
    };
    //내용 수정
    const _updateTask = item =>{
        const currentTasks = Object.assign({}, tasks);
        currentTasks[item.id] = item;
        _saveTasks(currentTasks);
    };
    // 키보드탈출
    const _onBlur = () => {
        setNewTask('');
    }
    //텍스트 변화
    const _handleTextChange = text =>{
        setNewTask(text);
    }
    //전체삭제
    const _allDelete = () => {
        const currentTasks = Object.assign({}, tasks);
        Object.values(tasks).map(item => {
            if(item.completed == true){
                delete currentTasks[item.id];
                _saveTasks(currentTasks);
            }
        });
    }
    
    
    return (
        <ThemeProvider theme={theme}>
            <Container onLayout={onLayoutRootView}>
                <StatusBar
                barStyle="light-content"
                background={theme.background}
                ></StatusBar>
                <Title>버킷 리스트</Title>
                <Input 
                placeholder="+ 항목추가"
                value={newTask}
                onChangeText={_handleTextChange}
                onSubmitEditing={_addTask}
                />
                <List width={width}>
                    {Object.values(tasks)
                           .reverse()
                           .map(item => (
                            <Task 
                            key={item.id}
                            item={item}
                            deleteTask={_deleteTask}
                            toggleTask={_toggleTask}
                            updateTask={_updateTask}
                            onBlur={_onBlur}
                            />
                           ))
                    }
                </List>
                <MyButton
                props={_allDelete}
                />
                
            </Container>
        </ThemeProvider>
    )
}