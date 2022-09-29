import FormControlLabel from '@mui/material/FormControlLabel';
import { Checkbox, CheckboxProps } from '@mui/material';
import { Box } from '@mui/system';

interface StyledCheckBoxProps {
  label: string;
  isChecked?: boolean;
  checkProps?: CheckboxProps;
  handler?: any
}

export const StyledCheckbox = ({ label, isChecked, checkProps, handler }: StyledCheckBoxProps) =>  {
  return (
      <Box style={{padding: '0'}}>
        <FormControlLabel control={<Checkbox {...checkProps} onChange={() => handler(!isChecked)} checked={isChecked} />} label={label} />
      </Box>
  );
}