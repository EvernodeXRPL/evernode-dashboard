import React from 'react';
import Loader from '../../components/Loader';

export default function LoaderScreen() {
  return (
    <div className="d-flex align-items-center vh-100 justify-content-center text-center font-weight-bold font-size-lg py-3">
      <div className="w-50 mx-auto">
        <Loader size="5rem" />
      </div>
    </div>
  );
}
