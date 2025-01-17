import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
	root: {},


  chatBox: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    width: 300,
    padding: theme.spacing(2),
    backgroundColor: '#f0f0f0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    zIndex: 1000,
    overflowY: 'auto', // Enable scrolling for chat messages
    maxHeight: '70vh', // Limit maximum height of chat box
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  messageInput: {
    marginBottom: theme.spacing(1),
  },
  messageWrapper: {
    marginBottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-start', // Default to left align
  },
  myMessage: {
    justifyContent: 'flex-end', // Align to right for my messages
  },
	profileImage: {
    borderRadius: '30px',
    border: '1px solid #100f0f',
  },
  messageBubble: {
    padding: theme.spacing(1),
    borderRadius: 8,
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    maxWidth: '70%', // Limit message width
    wordWrap: 'break-word',
		'& span': {
      fontSize: '12px',
      color: '#888',
      display: 'block',
    },
  },


}));
