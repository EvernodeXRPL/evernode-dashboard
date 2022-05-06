import { useContext } from 'react';
import { __RouterContext } from 'react-router';

const useFunc = () => useContext(__RouterContext);

export default useFunc;
