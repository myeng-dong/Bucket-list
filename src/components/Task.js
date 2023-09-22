import React, { useState } from "react";
import styled from 'styled-components/native'
import PropTypes from 'prop-types'
import IconButton from "./IconButton";
import { images } from "../Image";
import Input from "./Input";
import { Alert } from "react-native";

const Container = styled.View`
 flex-direction: row;
 align-items: center;
 background-color: ${({theme})=> theme.itemBackground};
 border-radius: 10px;
 padding: 5px;
 margin: 3px 0px;
`;
const Contents = styled.Text`
    flex: 1;
    font-size: 24px;
    color: ${({theme, completed})=> (completed ? theme.done : theme.text)};
    text-decoration-line: ${({completed}) =>
    completed ? 'line-through' : 'none'};
`;

const Task = ({item, deleteTask, toggleTask, updateTask }) =>{
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(item.text);
    const _handleUpdateButtonPress = () =>{
        setIsEditing(true);
    }
    const _onSubmitEditing = () =>{
        if(isEditing){
            const editedTask = Object.assign({}, item, {text});
            setIsEditing(false);
            updateTask(editedTask);
        }
    };
    const _onBlur = () =>{
        if(isEditing){
            setIsEditing(false);
            setText(item.text);
        }
    };

    const beforeAlert = (allDelete) =>
    Alert.alert('해당항목 삭제', '정말로 삭제하시겠습니까?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => allDelete(item.id)
       ,
    },
    ]);

    
    return isEditing ?(
        <Input
        value={text}
        onChangeText={text => setText(text)}
        onSubmitEditing={_onSubmitEditing}
        />
        ):(
        <Container>
            <IconButton 
            type={item.completed ? images.completed : images.uncompleted}
            id={item.id}
            onPressOut={toggleTask}
            completed={item.completed}
            />
            <Contents completed={item.completed}>{item.text}</Contents>
            {item.completed || (
            <IconButton 
            type={images.update}
            onPressOut={_handleUpdateButtonPress}
            />)}
            <IconButton 
            type={images.delete}
            id={item.id}
            onPressOut={() =>beforeAlert(deleteTask)}
            // onPressOut={deleteTask}
            completed={item.completed}
            onBlur={_onBlur}
            />
        </Container>
    );
};

Task.propTypes = {
    item: PropTypes.object.isRequired,
    deleteTask:PropTypes.func.isRequired,
    toggleTask:PropTypes.func.isRequired,
    updateTask:PropTypes.func.isRequired,
    onBlur:PropTypes.func.isRequired,
};

export default Task;