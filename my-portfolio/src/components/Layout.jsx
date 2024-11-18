import React from 'react';
import { Outlet } from 'react-router-dom';
import ThreeDImage from '../pages/ThreeDImage'; // The persistent 3D image

const Layout = () => {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* The persistent 3D image */}
      <ThreeDImage />

      {/* Where the routed pages will render */}
      <div style={{ marginTop: '100px' }}> {/* Adjust margin to fit content */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
