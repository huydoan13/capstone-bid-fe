import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AppbarMobile from "./appbarMobile";
import AppbarDesktop from "./appbarDesktop";
import AppbarDesktopLanding from "./appbarDesktopLanding";

export default function LandingAppbar(){
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));
    return(
        <>
        {matches ? <AppbarMobile matches={matches}/> : <AppbarDesktopLanding matches={matches}/>}
        </>
    );
}