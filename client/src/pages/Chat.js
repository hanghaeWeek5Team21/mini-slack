import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SmileOutlined } from '@ant-design/icons';
import swal from 'sweetalert';
import { Spin } from 'antd';
import Header from '../components/Header';
import Sider from '../components/Sidebar';
import { getCookie } from '../shared/Cookie';
import ChatMain from '../components/ChatMain';
import { config } from '../config';
import socketIOClient from 'socket.io-client';
import { useSelector } from 'react-redux';

function Chat(props) {
  const { history } = props;
  // 쿠키에 저장된 토큰 조회
  const cookie = getCookie('is_login') ? true : false;
  // 토큰이 없을 경우 사용을 못하게 로그인 화면으로 이동시키기
  if (!cookie) {
    swal({
      title: '토큰이 만료되었거나 잘못된 접근입니다.',
      text: '다시 로그인 해주세요!',
      icon: 'error',
    });
    history.replace('/');
  }

  console.log(props.match.params);
  const [currentSocket, setCurrentSocket] = useState();
  //   const room = props.match.params.otherId + '-' + props.match.params.myId;
  const rooms = [props.match.params.otherId, props.match.params.myId].sort();
  const room = rooms[0] + '-' + rooms[1];

  const username = useSelector((state) => state.user.user?.nickname);
  const Info = {
    room: room,
    username: username,
  };
  useEffect(() => {
    setCurrentSocket(socketIOClient(`${config.api}/chat`));
  }, []);
  if (currentSocket) {
    currentSocket.emit('join', Info);
  }
  return (
    <>
      <MainFrame>
        <Header />
        <MainContent>
          <MainLeft>
            <Sider />
          </MainLeft>
          <MainRight>
            {currentSocket ? (
              <ChatMain
                socket={currentSocket}
                username={username}
                room={room}
              />
            ) : (
              <Spin
                tip='Loading...'
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                }}
              />
            )}
          </MainRight>
        </MainContent>

        <Footer>
          🎨 Palette&nbsp;&nbsp;&nbsp;&nbsp;
          <SmileOutlined spin />
        </Footer>
      </MainFrame>
    </>
  );
}
const MainFrame = styled.div`
  & > button {
    border: none;
    outline: none;
    background: none;
  }

  & > button:hover {
    transform: scale(1.1);
  }

  @media only screen and (max-width: 768px) {
    margin: 30px auto;
  }
`;

const MainContent = styled.section`
  display: flex;
  background: #f0f2f5;
  min-height: 80vh;
  box-sizing: border-box;
`;

const MainLeft = styled.section`
  height: 100%;
  min-height: 80vh;
  padding: 16px 24px;
  border-right: 1px solid rgb(235, 237, 240);
  flex-basis: 25%;
`;

const MainRight = styled.section`
  position: relative;
  flex-basis: 75%;
  padding: 16px 24px;
  min-height: 80vh;
  &::after {
  }
`;

const Footer = styled.div`
  font-size: 24px;
  height: 95px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

export default Chat;
