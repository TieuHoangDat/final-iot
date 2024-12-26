import React from 'react';
import Sidebar from './Sidebar';
import NavbarComponent from './NavbarComponent';

const Layout = ({ children }) => {
  return (
    <div className="container-fluid bg-light">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 d-none d-md-block"> {/* Ẩn sidebar trên màn hình nhỏ hơn 'md' */}
          <Sidebar />
        </div>

        <div className="col-md-9">
          <NavbarComponent />
          <div className="row">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
