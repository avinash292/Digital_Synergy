import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthService from '../services/authService';
import PropTypes from 'prop-types';

const UnauthenticatedRoute = ({ component: Component, layout: Layout, accessRole, ...rest }) => {
	return (
		<Route {...rest} 
			render={props => AuthService.checkRoute(accessRole) ? (
				<Redirect to={{ pathname: "/" }} />
			) : (
				<Layout>
					<Component {...props} />
				</Layout>
			)}
		/>
	);
};


UnauthenticatedRoute.propTypes = {
	component: PropTypes.any.isRequired,
	path: PropTypes.string,
	exact: PropTypes.bool
};

export default UnauthenticatedRoute;