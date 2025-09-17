import Button from "../components/button";
import ChatContainer from "../components/chat-container";
import Container from "../components/container";
import SideBar from "../components/side-bar";
import TopBar from "../components/top-bar";
import { useMan } from "../hooks/man-provider";

const Chat = () => {

    const {
        value
    } = useMan();

    return (
        <Container>
            <TopBar>
                <Button
                    types="outline"
                >
                    Módulos de IA
                </Button>
                <Button
                    types="outline"
                >
                    Sobre o Projeto
                </Button>
            </TopBar>
            <Container
                style={{
                    flexDirection: 'row',
                    height: "100%",
                    width: "100%",
                    padding: 0,
                }}>
                <SideBar>

                </SideBar>
                <ChatContainer />
            </Container>
        </Container>
    )
}

export default Chat;