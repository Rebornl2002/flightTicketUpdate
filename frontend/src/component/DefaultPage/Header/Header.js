import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import Navbar from "./Navbar/Navbar";

const cx = classNames.bind(styles);

function Header() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("header-container")}>
        <div className={cx("header-logo")}>
          <img
            className={cx("logo-img")}
            alt="logo"
            src="https://res.flynow.vn/logoflynow.png"
          />
          <h1 className={cx("header-text")}>
            Vé máy bay, đặt mua vé máy bay tại đại lý vé máy bay Flynow
          </h1>
        </div>
        <span className={cx("hotline")}>
          Hotline: 1900 6432
          <span className={cx("space")}></span>
          (024) 7300 1133 - (028) 7300 1133
        </span>
      </div>
      <Navbar />
    </div>
  );
}

export default Header;
