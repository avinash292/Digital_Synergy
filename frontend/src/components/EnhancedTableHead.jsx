import React from 'react';
import PropTypes from 'prop-types';

// import { makeStyles } from '@material-ui/core/styles';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TableCell from '@material-ui/core/TableCell';

/* const useHeadStyles = makeStyles(theme => ({
	visuallyHidden: {
		border: 0,
		clip: 'rect(0 0 0 0)',
		height: 1,
		margin: -1,
		overflow: 'hidden',
		padding: 0,
		position: 'absolute',
		top: 20,
		width: 1,
	},
})); */

const EnhancedTableHead = (props) => {
	// const classes = useHeadStyles();
	const { onSelectAll, order, orderBy, numSelected, rowCount, onRequestSort, headCells } = props;
	const haveMultiSelect = props.haveMultiSelect !== undefined ? props.haveMultiSelect : true;
	const createSortHandler = property => event => {
	  onRequestSort(event, property);
	};
	return (
		<TableHead>
			<TableRow>
				{ haveMultiSelect ? (
					<TableCell padding="checkbox">
						<Checkbox
							indeterminate={numSelected > 0 && numSelected < rowCount}
							checked={rowCount > 0 && numSelected === rowCount}
							onChange={onSelectAll}
						/>
					</TableCell>
				) : null }
				{headCells.map(headCell => (
					<TableCell
						key={headCell.key}
						align={headCell.numeric ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sortDirection={orderBy === headCell.key ? order : false}
					>
						{headCell.sortable ? (
							<TableSortLabel
								active={orderBy === headCell.key}
								direction={orderBy === headCell.key ? order : 'asc'}
								onClick={createSortHandler(headCell.key)}
							>
								<b>{headCell.label}</b>
								{/* {orderBy === headCell.id ? (
									<span className={classes.visuallyHidden}>
										{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
									</span>
								) : null} */}
							</TableSortLabel>
						) : (
							headCell.label
						)}						
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}
  
EnhancedTableHead.propTypes = {
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAll: PropTypes.func.isRequired,
	order: PropTypes.oneOf(['asc', 'desc']).isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired,
	headCells: PropTypes.array.isRequired,
	haveMultiSelect: PropTypes.bool,
};

export default EnhancedTableHead;