import { HighlightOutlined, SettingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Menu, MenuProps, Modal } from 'antd';
import './navbar.scss'

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
                    key: 'On',
                    onClick: () => chrome.storage.local.set({ panelOpen: true })
                },
                {
                    label: 'Off',
                    key: 'Off',
                    onClick: () => chrome.storage.local.set({ panelOpen: false })
                },
            ],
        }
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
                    defaultSelectedKeys={['On']}
                    items={items}>
                </Menu>
            </Modal>
        </div>
    )
}