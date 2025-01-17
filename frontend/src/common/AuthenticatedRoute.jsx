import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthService from '../services/authService';
import PropTypes from 'prop-types';

const AuthenticatedRoute = ({ component: Component, layout: Layout, accessRole, ...rest }) => {
	return (
		<Route {...rest} 
			render={props => AuthService.checkRoute(accessRole) ? <Layout><Component {...props} /></Layout> : <Redirect to={{ pathname: "/signin" }} />}
		/>
	);
};

AuthenticatedRoute.propTypes = {
	component: PropTypes.any.isRequired,
	path: PropTypes.string,
	exact: PropTypes.bool
};

export default AuthenticatedRoute;