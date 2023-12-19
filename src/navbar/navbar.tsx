import { HighlightOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import './navbar.scss'
import { useState } from 'react';
import { Menu, MenuProps, Modal } from 'antd';

export const Nav: React.FC = () => {

    const [settingsOpen, setSettingsOpen] = useState<boolean>(false)

    const items: MenuProps['items'] = [
        {
            label: 'Highlight & Export',
            key: 'highlight-export',
            icon: <HighlightOutlined />,
            children: [
                {
                    label: 'On',
                    key: 'setting:1',
                },
                {
                    label: 'Off',
                    key: 'setting:2',
                },
            ],
        },
        { type: 'divider' },
        {
            label: 'Sign Out',
            key: 'sign-out',
            icon: <LogoutOutlined />

        },
    ];

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
                    items={items}>
                </Menu>
            </Modal>
        </div>
    )
}