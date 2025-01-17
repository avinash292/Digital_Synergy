import createBreakpoints from "@material-ui/core/styles/createBreakpoints";

const breakpoints = createBreakpoints({
	keys: ["xs", "sm", "md", "lg", "xl", "mobile", 'tablet' , 'laptop', 'desktop'],
	values: {
		xs: 0,
		sm: 600,
		md: 960,
		lg: 1280,
		xl: 1920,
		mobile: 0,
		tablet: 400,
		laptop: 600,
		desktop: 1280,
	},
});

export default breakpoints;