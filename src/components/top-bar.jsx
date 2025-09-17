import Logo from '../assets/logo.png';
import Button from './button';
import Unifenas from "../assets/unifenas.png";

const TopBar = ({ children }) => {
    return (
        <div
            style={{
                display: "flex",
                width: '100%',
                height: "64px",
                backgroundColor: "transparent",
                alignItems: 'center',
                justifyContent: 'space-around',
            }}
        >
            <img src={Logo} alt="Logo" style={{ height: '50%' }} />
            <div
            style={{
                display: 'flex',
                gap: '56px',
                alignItems: 'center',
                justifyContent: 'center',

            }}
            >
                {children}
            </div>
            <Button
                types="top"
            >
                <img src={Unifenas} alt="Unifenas" style={{ height: '20px', width: '20px' }} />
                Conheça a Unifenas
            </Button>
        </div>
    );
}

export default TopBar;