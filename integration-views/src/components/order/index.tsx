import { lazy } from 'react';

const Order = lazy(() => import('./order' /* webpackChunkName: "orders" */));

export default Order;
