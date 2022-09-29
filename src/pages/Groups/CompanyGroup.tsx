import { Divider, Box, Avatar, List, ListItem, ListItemButton, ListItemText } from "@mui/material";

const CompanyGroup = (props: any) => {
  const { collaborators, setCollaborators, targetCompanies } = props;

  const onSelect = (i: number) => {
    let isSelected = collaborators.findIndex((collaborator: any) => targetCompanies[i].id == collaborator.id) != -1;
    if (!isSelected) {
      setCollaborators([...collaborators, targetCompanies[i]]);
    }
  }

  const getCircleName = (name: string) => {
    const strs = name.split(' ').map((str) => { return str[0] });
    return strs[0] + strs[1];
  };

  return (
    <List>
      <Divider sx={{ width: {xs: "100%", md: "100%"}, border: "1px solid #F1F1F1" }} />
      {
        targetCompanies?.map((company: any, index: number) => (
          <Box key={company.id}>
            <ListItem disablePadding style={company.isSelected ? { opacity: '0.3', background: '#D9D9D9' } : {}} onClick={() => onSelect(index)}>
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
                  {company?.name[0] + company?.name[1]}
                </Avatar>
                <ListItemText primary={company.name} sx={{ ml: "20px", width: "75%", fontSize: "16px", fontWeight: 500, lineHeight: "24px" }} />
                <ListItemText primary={company.isSelected ? "Odabrana" : ""} sx={{fontSize: "14px", fontWeight: 500, lineHeight: "22px", color: "#222222"}} />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ width: {xs: "100%", md: "100%"}, border: "1px solid #F1F1F1" }}/>
          </Box>
        ))
      }
    </List>
  )
}

export default CompanyGroup;