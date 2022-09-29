import { Divider, Box, Avatar, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { ReactComponent as CloseIcon } from './icons/close-icon.svg';

const SelectedGroup = (props: any) => {
  const { collaborators, setCollaborators } = props;
  const onClose = (id: string) => {
    const temp = collaborators.filter((item: any) => item.id != id);
    setCollaborators(temp);
  }

  const getCircleName = (name: string) => {
    const strs = name.split(' ').map((str) => { return str[0] });
    return strs[0] + strs[1];
  };

  return (
    <List>
      <Divider sx={{ width: { xs: "100%", md: "100%" }, border: "1px solid #F1F1F1" }} />
      {
        collaborators?.map((item: any, index: number) => (
          <Box key={item.id}>
            <ListItem disablePadding>
              <ListItemButton sx={{ pl: "35px" }}>
                <Avatar
                  sx={{
                    height: "47px",
                    width: "47px",
                    fontSize: "18px",
                    fontWeight: "700",
                    lineHeight: "26px",
                    textTransform: "uppercase",
                  }}
                >
                  {item?.name[0] + item?.name[1]}
                </Avatar>
                <ListItemText primary={item.name} sx={{ ml: "20px" }} />
                <ListItemIcon sx={{ mr: "0px" }}>
                  <CloseIcon onClick={() => onClose(item.id)} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem><Divider sx={{ width: { xs: "100%", md: "100%" }, border: "1px solid #F1F1F1" }} />
          </Box>
        ))
      }
    </List>
  )
}

export default SelectedGroup;