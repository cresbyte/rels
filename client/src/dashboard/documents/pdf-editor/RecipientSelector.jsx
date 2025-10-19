import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from '@mui/material';

const RecipientSelector = ({
  open,
  recipients,
  onClose,
  onSelect,
}) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assign to Recipient</DialogTitle>
      <DialogContent>
        <List>
          {recipients.map((recipient) => (
            <ListItem key={recipient.id} disablePadding>
              <ListItemButton
                onClick={() => {
                  onSelect(recipient.id);
                  onClose();
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#3b82f6' }}>
                    {getInitials(recipient.name)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={recipient.name}
                  secondary={recipient.email}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default RecipientSelector;
