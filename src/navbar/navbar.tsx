import { SettingOutlined } from '@ant-design/icons';
import './navbar.scss'

export const Nav: React.FC = () => {

    return (
        <div className="navContainer">
            <img 
                className="logo" 
                src="/images/logo_dark.png"
            />
            <SettingOutlined
                className="settingsIcon"
            />
        </div>
    )
}