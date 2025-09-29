import Logo from "../../assets/logo.png";
import Unifenas from "../../assets/unifenas.png";
import Button from "../button";
import styles from "./top-bar.module.css";

const TopBar = ({ children }) => {
  return (
    <div className={styles.topbar}>
      <img src={Logo} alt="Logo" className={styles.logo} />

      <div className={styles.nav}>{children}</div>

      <Button types="top" className={styles.btn}>
        <img
          src={Unifenas}
          alt="Unifenas"
          style={{ height: "20px", width: "20px" }}
        />
        Conheça a Unifenas
      </Button>
    </div>
  );
};

export default TopBar;
