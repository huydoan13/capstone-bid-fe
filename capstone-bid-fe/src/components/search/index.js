import {  IconButton, Slide, TextField } from "@mui/material";
import {  styled } from "@mui/system";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { Colors } from "../../style/theme";
import { useUIContext } from "../../context/ui";
import { SearchBoxContainer } from "../../style/search";



const SearchField = styled(TextField)(({ theme }) => ({
  ".MuiInputLabel-root": {
    color: Colors.secondary,
  },
    ".MuiInput-root": {
        fontSize: '1rem',
        [theme.breakpoints.up('md')]: {
            fontSize: '2rem',
        },
    color: Colors.secondary,
  },
  ".MuiInput-root::before": {
    borderBottom: `1px solid ${Colors.secondary}`,
  },
  padding: "0 0 0 40px",
}));

export default function SearchBox() {
    const { showSearchBox, setShowSearchBox } = useUIContext();

  return (
    <Slide direction="down" in={showSearchBox} timeout={500}>
      <SearchBoxContainer>
        <SearchField
          color="secondary"
          variant="standard"
          fullWidth
          placeholder="Tìm Kiếm..."
        />
        <IconButton>
                  <SearchIcon sx={{ fontSize: { xs: '2rem', md: "3rem" } }} color="white" />
        </IconButton>
              <IconButton
                  onClick={() => setShowSearchBox(false) }
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
          }}
        >
          <CloseIcon sx={{ fontSize: "4rem" }} color="white" />
        </IconButton>
      </SearchBoxContainer>
    </Slide>
  );
}