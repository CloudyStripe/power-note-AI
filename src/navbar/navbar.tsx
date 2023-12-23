import { HighlightOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import './navbar.scss'
import { useState } from 'react';
import { Menu, MenuProps, Modal } from 'antd';

export const Nav: React.FC = () => {

    const [settingsOpen, setSettingsOpen] = useState<boolean>(false)
    const [defaultKey, setDefaultKey] = useState<'On' | 'Off' | undefined>(undefined)

    const statusCheck = async (open: boolean) => {
        if(open === true){
            const panelStatus = await chrome.storage.local.get(['panelOpen'])
            setDefaultKey(panelStatus.panelOpen)
        }
    }

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
                afterOpenChange={(open: boolean) => statusCheck(open)}
                className="settingsModal"
                footer={null}
                onCancel={() => setSettingsOpen(false)}
                open={settingsOpen}
                title="Settings">
                <Menu 
                    mode='inline' 
                    defaultSelectedKeys={defaultKey ? [defaultKey] : undefined}
                    items={items}>
                </Menu>
            </Modal>
        </div>
    )
}