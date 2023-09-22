import React, { useState } from "react";
import { Alert } from "react-native";
import styled from "styled-components/native";
import { Dimensions } from "react-native";

const ButtonStyle = styled.TouchableOpacity`
    width: ${({width}) => width - 40}px;
    font-size: 24px;
    justify-content: end;
    background-color: #9b59b6;
    height: 60px;
    margin: 3px 0;
    padding: 15px 20px;
    border-radius: 10px;
`;

const Title = styled.Text`
    font-size: 24px;
    font-weight: 600;
    color: #fff;
    text-align: center;
`;




const MyButton = ({props}) =>{
    
    const beforeAlert = (allDelete) =>
    Alert.alert('완료항목 전체삭제', '정말로 삭제하시겠습니까?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: allDelete
    },
    ]);
    const width = Dimensions.get('window').width;

    
    
return(
        <ButtonStyle 
        width = {width}
        onPress={()=>beforeAlert(props)}
        >
            <Title>완료항목 전체삭제</Title>
        </ButtonStyle>
)
}



export default MyButton;