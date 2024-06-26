import React, { useEffect } from 'react';
import { Button, Card, Col, Input, Menu, MenuProps, message, Row, Space, Typography, Upload, UploadFile } from "antd";
import { CopyOutlined, UploadOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { startPeer, stopPeerSession, toggleMutualExclusion } from "./store/peer/peerActions";
import * as connectionAction from "./store/connection/connectionActions"
import { DataType, PeerConnection } from "./helpers/peer";
import { useAsyncState } from "./helpers/hooks";

const { Title } = Typography
type MenuItem = Required<MenuProps>['items'][number]

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

export const App: React.FC = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const peer = useAppSelector((state) => state.peer)
    const connection = useAppSelector((state) => state.connection)
    const dispatch = useAppDispatch()
    const token = localStorage.getItem("token")

    useEffect(() => {
        if (!token) {
            window.location.href = "/login"
        }
    }, [token])

    const handleStartSession = () => {
        dispatch(startPeer())
    }

    const handleStopSession = async () => {
        await PeerConnection.closePeerSession()
        dispatch(stopPeerSession())
    }

    const handleConnectOtherPeer = () => {
        connection.id != null ? dispatch(connectionAction.connectPeer(connection.id || "")) : message.warning("Please enter ID")
    }

    const handleDisconnectPeer = (id: string) => {
        dispatch(connectionAction.disconnectPeer(id))
    }

    const [fileList, setFileList] = useAsyncState([] as UploadFile[])
    const [sendLoading, setSendLoading] = useAsyncState(false)

    const handleUpload = async () => {
        if (fileList.length === 0) {
            message.warning("Please select file")
            return
        }
        if (!connection.selectedId) {
            message.warning("Please select a connection")
            return
        }
        try {
            await setSendLoading(true);
            let file = fileList[0] as unknown as File;
            let blob = new Blob([file], { type: file.type });

            await PeerConnection.sendConnection(connection.selectedId, {
                dataType: DataType.FILE,
                file: blob,
                fileName: file.name,
                fileType: file.type
            })
            await setSendLoading(false)
            message.info("Send file successfully")
        } catch (err) {
            await setSendLoading(false)
            console.log(err)
            message.error("Error when sending file")
        }
    }

    return (
        <Row
            style={{
                // backgroundColor: "blue",
                // backgroundColor: "#9b69f1",
                height: "97vh",
                boxShadow: "0 0 10px 0 rgba(0,0,0,0.3)",
                borderRadius: 15,
                position: "relative",
            }}
            justify={"center"} align={"top"}>
            <Col
                xs={24} sm={24} md={20} lg={16} xl={12}>
                <Card
                    style={{
                        // marginTop: "20px",
                        backgroundColor: "#9b69f1",
                    }}
                >
                    <Title level={2} style={{ textAlign: "center", fontWeight: "bold", color: "white" }}>Welcome To PeerShare, {user.name}!</Title>
                    {/* logout button */}
                    <div
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    >
                    <Button
                        style={{
                            color: "white",
                            backgroundColor: "#ff3333",
                            width: "100px",
                            height: "40px",
                            fontSize: "1rem",
                            fontWeight: "bold",
                            letterSpacing: "1px",
                            transition: "all 0.3s",
                            marginBottom: "20px",
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                        }}
                        onClick={() => {
                            localStorage.clear()
                            window.location.href = "/login"
                        }}>Logout</Button>
                    </div>
                    <Card
                        style={{
                            // width: "100%",
                            // display: "flex",
                            // alignItems: "center",
                            // justifyContent: "center",
                        }}
                        hidden={peer.started}>
                        <Button
                            hidden={peer.started}
                            style={{
                                color: "white",
                                backgroundColor: "#7c3aed",
                                width: "150px",
                                height: "50px",
                                fontSize: "1.2rem",
                                fontWeight: "bold",
                                letterSpacing: "1px",
                                // scaling on hover
                                transition: "all 0.3s",
                            }}
                            onClick={handleStartSession} loading={peer.loading}>Start</Button>
                    </Card>
                    <Card hidden={!peer.started}>
                        <Space direction="horizontal">
                            <div>ID: {peer.id}</div>
                            <Button icon={<CopyOutlined />} onClick={async () => {
                                await navigator.clipboard.writeText(peer.id || "")
                                message.info("Copied: " + peer.id)
                            }} />
                            <Button danger onClick={handleStopSession}>Stop</Button>
                        </Space>
                    </Card>
                    <div
                        style={{
                            // width: "100%",
                            marginTop: "20px",
                            // display: "flex",
                            flexDirection: "column",
                            // alignItems: "start",
                            // justifyContent: "start",
                            gap: "15px",
                        }}
                        hidden={!peer.started}>
                        <Card>
                            <Space direction="horizontal">
                                <Input placeholder={"ID"}
                                    onChange={e => dispatch(connectionAction.changeConnectionInput(e.target.value))}
                                    required={true}
                                />
                                <Button
                                    style={{
                                        color: "white",
                                        backgroundColor: "#7c3aed",
                                        // width: "150px",
                                        // height: "50px",
                                        fontSize: "0.75rem",
                                        fontWeight: "bold",
                                        letterSpacing: "1px",
                                        // scaling on hover
                                        transition: "all 0.3s",
                                    }}
                                    onClick={handleConnectOtherPeer}
                                    loading={connection.loading}>Connect</Button>
                                
                                <Button
                                    style={{
                                        color: "white",
                                        backgroundColor: "#7c3aed",
                                        // width: "150px",
                                        // height: "50px",
                                        fontSize: "0.75rem",
                                        fontWeight: "bold",
                                        letterSpacing: "1px",
                                        // scaling on hover
                                        transition: "all 0.3s",
                                    }}
                                    onClick={() => dispatch(toggleMutualExclusion())}
                                    // loading={connection.loading}
                                > {peer.mE ? "Disable ME" : "Enable ME"}</Button>
                            </Space>
                        </Card>

                        <Card
                            style={{
                                marginTop: "20px",
                            }}
                            title="Connection">
                            {
                                connection.list.length === 0
                                    ? <div>Waiting for connection ...</div>
                                    : <div>
                                        Select a connection
                                        {/* <Menu selectedKeys={connection.selectedId ? [connection.selectedId] : []}
                                                  onSelect={(item) => dispatch(connectionAction.selectItem(item.key))}
                                                  items={connection.list.map(e => getItem(e, e, null))}/> */}

                                        <Menu
                                            selectedKeys={connection.selectedId ? [connection.selectedId] : []}
                                            onSelect={(item) => dispatch(connectionAction.selectItem(item.key))}
                                        >
                                            {connection.list.map(e => (
                                                <Menu.Item key={e}
                                                    style={{
                                                        // alignItems: "center",
                                                        display: 'inline-flex',
                                                        justifyContent: 'space-between'

                                                    }}
                                                >
                                                    <span>{e}</span>

                                                    <Button
                                                        danger
                                                        onClick={() => handleDisconnectPeer(e)}
                                                        style={{
                                                            // float: 'right',
                                                            marginLeft: '10px',
                                                        }}
                                                    >
                                                        Disconnect
                                                    </Button>
                                                </Menu.Item>
                                            ))}
                                        </Menu>

                                    </div>
                            }

                        </Card>
                        <Card style={{
                            marginTop: "20px",
                        }} title="Send File">
                            <Upload
                                fileList={fileList}
                                maxCount={1}
                                onRemove={() => setFileList([])}
                                beforeUpload={(file) => {
                                    setFileList([file])
                                    return false
                                }}>
                                <Button icon={<UploadOutlined />}>Select File</Button>
                            </Upload>
                            <Button
                                type="primary"
                                onClick={handleUpload}
                                disabled={fileList.length === 0}
                                loading={sendLoading}
                                style={{ marginTop: 16 }}
                            >
                                {sendLoading ? 'Sending' : 'Send'}
                            </Button>
                        </Card>
                    </div>
                </Card>
            </Col>


        </Row>
    )
}

export default App
