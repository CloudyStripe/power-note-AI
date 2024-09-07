import { EyeInvisibleOutlined, EyeTwoTone, HighlightOutlined, KeyOutlined, SettingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Input, Menu, Modal } from 'antd';
import './navbar.scss';

interface INav {
    keySetter: (key: string) => void;
}

export const Nav: React.FC<INav> = (props) => {
    const { keySetter } = props;
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { SubMenu } = Menu

    return (
        <div className="navContainer">
            <img className="logo" src="/images/logo_dark.png" alt="Logo" />
            <SettingOutlined
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="settingsIcon"
            />
            <Modal
                className="settingsModal"
                footer={null}
                onCancel={() => setSettingsOpen(false)}
                open={settingsOpen}
                title="Settings"
            >
                <Menu mode='inline' defaultSelectedKeys={['on']}>
                    <SubMenu title="Highlight & Export" icon={<HighlightOutlined />}>
                        <Menu.Item key='on'>On</Menu.Item>
                        <Menu.Item key='off'>Off</Menu.Item>
                    </SubMenu>
                    <SubMenu className="keyHeader" title="Open AI Key" icon={<KeyOutlined />}>
                        <Menu.Item key="input">
                            <Input.Password
                                className="keyInput" 
                                placeholder="Open AI Key" 
                                onChange={(e) => keySetter(e.target.value)}
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Modal>
        </div>
    );
}