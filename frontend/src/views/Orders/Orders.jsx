import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

// import useMediaQuery from '@material-ui/core/useMediaQuery';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import LinearProgress from '@material-ui/core/LinearProgress';
import Chip from '@material-ui/core/Chip';


import useStyles from './OrderStyle';
import useCommonStyles from '../../common/style';
import API from '../../axios/axiosApi';
import { SectionHeader } from 'components/molecules';
import { formatDate, formatCurrency, formatUnderscore } from 'utils/formatter';
import { COMMON_ERR_MSG } from '../../config';
import EnhancedTablePaginationActions from 'components/EnhancedTablePaginationActions';
import EnhancedTableHead from 'components/EnhancedTableHead';

const headCells = [
	{ key: 'id', numeric: false, disablePadding: false, label: '#ID', sortable: true },
	{ key: 'full_name', numeric: false, disablePadding: false, label: 'Ship To', sortable: true },
	{ key: 'total_quantity', numeric: false, disablePadding: false, label: 'Total Quantity', sortable: true },
	{ key: 'total_price', numeric: false, disablePadding: false, label: 'Total Amount', sortable: true },
	{ key: 'order_status', numeric: false, disablePadding: false, label: 'Status', sortable: true },
	{ key: 'createdAt', numeric: false, disablePadding: false, label: 'Ordered At', sortable: true },
];

const Orders = ({ history }) => {
	const classes = useStyles();
	const commonClasses = useCommonStyles();
	const [loading, setLoading] = useState(false);
	const [records, setRecords] = useState([]);
	const [totalRecords, setTotalRecords] = useState(0);
	const [order, setOrder] = useState('desc');
	const [orderBy, setOrderBy] = useState('createdAt');
	const [pageSize, setPageSize] = useState(10);
	const [page, setPage] = useState(0);
	const [snack, setSnack] = useState({ open: false, message: '' });
	// const debouncedSearch = useDebounce(search, 500);

  // const isDesktop = useMediaQuery(theme => theme.breakpoints.up('md'));


	useEffect(() => {
		const fetchOrders = async () => {
			try {
				setLoading(true);
				let postData = {
					order,
					orderBy,
					pageOffset: page * pageSize,
					pageSize,
					// searchText: debouncedSearch,
				};
				const response = await API.post('orders', postData);
				if (response.data.success && response.data.data) {
					setRecords(response.data.data.rows);
					setTotalRecords(response.data.data.count);
				}
				setLoading(false);
			} catch (error) {
				console.log("ERROR in fetchOrders : ", error);
				setLoading(false);
				const errorMsg = (error.response && error.response.data && error.response.data.message) ? error.response.data.message : COMMON_ERR_MSG;
				handleSnackToogle(errorMsg);
			}
		};
		fetchOrders();
	}, [page, pageSize, order, orderBy]);

	/**
	 * Handle sorting change
	 * 
	 * @param {*} event 
	 * @param {*} property 
	 */
	 const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	/**
	 * Handle page change and refeacth data
	 * 
	 * @param {*} event 
	 * @param {*} newPage 
	 */
	 const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	/**
	 * On change page size
	 * 
	 * @param {*} event 
	 */
	const handleChangeRowsPerPage = event => {
		setPageSize(parseInt(event.target.value, 10));
		setPage(0);
	};

	/**
	 * Proceed to checkout screen
	 */
	const openDetailPage = (index) => {
		if (records[index]) {
			history.push('/orders/' + records[index].id);
		}
	};

	const getChipColor = (orderStatus) => {
		let color = '#FE9800';
		switch (orderStatus) {
			case 'ordered'		: color = '#FE9800';	break;
			case 'delivered'	: color = '#4CAF4F';	break;
			default						: color = '#FE9800';	break;
		}
		return color;
	};

	const handleSnackToogle = (message) => {
		setSnack(snack => ({ open: !snack.open, message: message || '' }));
	};

	return (
		<div className={classes.root}>
			<div className={classes.pageTitle}>
				<Typography variant="h3">Orders</Typography>
			</div>
			<div className={classes.content}>
			{totalRecords ? (
				<Paper className={clsx(classes.paper, commonClasses.paperContainer)}>
					{ loading ? <LinearProgress className={commonClasses.progressBar} /> : null }
					<TableContainer>
						<Table className={classes.table} size='medium'>
							<EnhancedTableHead
								numSelected={0}
								order={order}
								orderBy={orderBy}
								onSelectAll={() => {}}
								onRequestSort={handleRequestSort}
								rowCount={records.length}
								headCells={headCells}
								haveMultiSelect={false}
							/>
							<TableBody>
							{ records.length === 0 ? (
								<TableRow>
									<TableCell colSpan={headCells.length}>No records found</TableCell>
								</TableRow> ): null }
							{ records.map((row, index) => {
								const labelId = `enhanced-table-checkbox-${index}`;
								return (
									<TableRow
										hover
										key={index}
										onClick={() => openDetailPage(index)}
										className={classes.rowHover}
									>
										<TableCell component="th" id={labelId} scope="row">
											{row.order_number}
										</TableCell>
										<TableCell>{row.addresses[0] ? row.addresses[0].full_name : '-'}</TableCell>
										<TableCell>{row.total_quantity}</TableCell>
										<TableCell>${formatCurrency(row.total_price)}</TableCell>
										<TableCell>
											<Chip className={classes.statusChip} style={{ backgroundColor: getChipColor(row.order_status) }} label={formatUnderscore(row.order_status)} />
										</TableCell>
										{/* <TableCell>{formatUnderscore(row.order_status)}</TableCell> */}
										<TableCell>{formatDate(row.createdAt)}</TableCell>
										{/* <TableCell align="right">{row.label}</TableCell> */}
									</TableRow>
								);
							}) }
							{/* emptyRows > 0 && (
								<TableRow style={{ height:  53 * emptyRows }}>
									<TableCell colSpan={6} />
								</TableRow>
							) */}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						rowsPerPageOptions={[5, 10, 25, 100]}
						component="div"
						count={totalRecords}
						rowsPerPage={pageSize}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
						ActionsComponent={EnhancedTablePaginationActions}
					/>
				</Paper>
			) : (
				<SectionHeader
					title="You haven't ordered anything yet!"
					titleProps={{
						variant: 'h4',
					}}
					ctaGroup={[
						<Button
							size="large"
							variant="contained"
							color="primary"
							onClick={() => history.push('/')}
						>
							Start shopping
						</Button>
					]}
					disableGutter
				/>
			)}
			</div>

			{/* </Section> */}
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				open={snack.open}
				onClose={() => handleSnackToogle()}
				message={snack.message}
				autoHideDuration={2000}
			/>
		</div>
	);
};


export default Orders;
