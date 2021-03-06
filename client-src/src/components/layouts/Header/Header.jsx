import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from '../../../actions/auth.action';

import classnames from 'classnames';
import Logo from '../../../image/core-img/logo.png';
import MiniCart from '../../Cart/MiniCart';
import MiniProfile from '../../Profile/MiniProfile';
// import Logo from '../../../image/core-img/logo.png';
import Message from '../../../image/core-img/message.png';
import Placeholder from '../../../image/core-img/placeholder.png';
//import HeaderIcons from '@/HeaderIcons/HeaderIcons';

class Header extends Component {
  constructor(props) {
      super(props);

      this.state = {
          isShow: false,
      };
  }
  onLogoutClick(e) {
    e.preventDefault();
    // this.props.clearCurrentProfile();
    this.props.logoutUser();
  }
  render() {
    const { isShow } = this.state;
    const { isAuthenticated, user } = this.props.auth;
    const AuthButton2 = !isAuthenticated ? (
      <li><Link to="/login">ĐĂNG NHẬP</Link></li>
    ) : (
      <>
        <li><Link to="/profile">TÀI KHOẢN</Link></li>
        <li><Link to="/orders">ĐƠN HÀNG</Link></li>
        <li><a onClick={e => this.onLogoutClick(e)}>ĐĂNG XUẤT</a></li>
      </>
    );
    const profileMini = !isAuthenticated ? (
      <></>
    ) : (
      <a>
        <MiniProfile/>
      </a>
    );
    const Barcontent =
    (
        <ul>
          <li>
            <Link to="/">TRANG CHỦ</Link>
          </li>
          <li>
            <Link to="/cart">GIỎ HÀNG</Link>
          </li>
          {AuthButton2}
        </ul>
      );
    const LogoSource = (
      <div className="logo" style={{ marginTop: "3px" }}>
        <Link to="/">
          <a>
            <img src={Logo} alt="" />
          </a>
        </Link>
      </div>
    );
    return (
      <header>
        <div className="header-area">
          <div className="top-header-area">
            <div className="container h-100">
              <div className="row h-100 align-items-center">
                <div className="col-12 d-flex justify-content-between">
                  {LogoSource}
                  <div className="top-contact-info d-flex align-items-center">
                    <a
                      href="https://www.hust.edu.vn"
                      target="blank"
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title="25 th Street Avenue, Los Angeles, CA"
                    >
                      <img src={Placeholder} alt="" />
                      {/* <span>17th, Trần Đại Nghĩa, Hà Nội</span> */}
                    </a>
                    <a
                      href="https://www.hust.edu.vn"
                      target="blank"
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title="www.hust.edu.vn"
                    >
                      <img src={Message} alt="" />
                      {/* <span>www.hust.edu.vn</span> */}
                    </a>
                    <div style={{width: 15}}></div>
                    <Link to="/search">
                      <i class="fas fa-search" style={{color: "#ffbb38", fontSize: 20, marginTop: 4}}></i>
                    </Link>
                    <div style={{width: 15}}></div>
                    <a>
                      <MiniCart/>
                    </a>
                    <div style={{width: 15}}></div>
                    {/* <a>
                      <MiniProfile/>
                    </a> */}
                    {profileMini}
                  </div>
                </div>
            </div>
          </div>
           <div style={{ height: "15px" }} />
           <div className="container">
             <div
               id="omega"
               className={classnames({ "omega-activated": isShow })}
             >
               <div id="omega-content">
                 <nav>{Barcontent}</nav>
               </div>
               <button
                 className="btn btn-warning"
                  onClick={() => this.setState(pre => ({ isShow: !pre.isShow }))}
                 id="omega-button"
               >
                 &#9776;
               </button>
               <div id="omega-sidebar">
                 <div id="omega-sidebar-header">
                   <button
                      onClick={() =>
                        this.setState(pre => ({ isShow: !pre.isShow }))
                      }
                     style={{
                       position: "relative",
                       left: "75%",
                       margin: "5px",
                       height: "auto",
                       borderRadius: "15%"
                     }}
                     type="button"
                     className="btn btn-warning"
                     aria-label="Close"
                   >
                     <span
                       aria-hidden="true"
                       style={{ fontSize: "x-large", fontWeight: 900 }}
                     >
                       &times;
                     </span>
                   </button>
                 </div>
                 <div id="omega-sidebar-body">
                   <nav>{Barcontent}</nav>
                 </div>
               </div>
               <div id="omega-overlay" />
             </div>
           </div>
         </div>
         </div>
       </header>
     );
  }
}


// export default Header;
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
});

const mapDispatchToProps = { logoutUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(Header));
