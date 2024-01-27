import { HighlightOutlined, KeyOutlined, SettingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Input, Menu, Modal } from 'antd';
import './navbar.scss'

interface INav {
    keySetter: (key: string) => void;
}

export const Nav: React.FC<INav> = (props) => {

    const { keySetter } = props;

    const [settingsOpen, setSettingsOpen] = useState<boolean>(false)

    const {SubMenu} = Menu

    return (
        <div className="navContainer">
            <img
                className="logo"
                src="/images/logo_dark.png"
            />
            <SettingOutlined
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="settingsIcon"
            />
            <Modal
                className="settingsModal"
                footer={null}
                onCancel={() => setSettingsOpen(false)}
                open={settingsOpen}
                title="Settings">
                <Menu
                    mode='inline'
                    defaultSelectedKeys={['on']}>
                        <SubMenu title="Highlight & Export" icon={<HighlightOutlined/>}>
                            <Menu.Item key='on'>
                                On
                            </Menu.Item>
                            <Menu.Item key='off'>
                                Off
                            </Menu.Item>
                        </SubMenu>
                    <SubMenu key="open-ai-key" title="Open AI Key" icon={<KeyOutlined/>}>
                        <Menu.Item key="input">
                            <Input placeholder="Open AI Key" onChange={(e) => keySetter(e.target.value)} />
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Modal>
        </div>
    );
}