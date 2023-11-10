import {AppBar, Toolbar, Link, Typography} from "@mui/material";
import {useTheme} from "@mui/material/styles"; // импортировать это

const PrimaryAppBar = () => {
    const theme = useTheme()
    return (
        // в toolbar мы импортируем тему, которую ранее создали
        <AppBar
            sx={{
                /* Ниже мы сбрасываем цвет верхнего меню до белого цвета, а
            также настраиваем цвет нижней границы */
                backgroundColor: theme.palette.background.default,
                borderBottom: `1px solid ${theme.palette.divider}`
            }}>
            <Toolbar
                variant="dense"
                sx={{
                    height: theme.primaryAppBar.height,
                    minHeight: theme.primaryAppBar.height
                }}>
                {/* 
                Ниже мы настраиваем логотип как ссылку саму на себя
                Также прописываем размер шрифта, не забудьте импортировать
                компоненты Link и Typography
                */}
                <Link href="/" underline="none" color="inherit">
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            display: {
                                fontWeight: 700,
                                letterSpacing: "-0,5px"
                            }
                        }}>
                        DJCHAT
                    </Typography>
                </Link>
            </Toolbar>
        </AppBar>
    );
};
export default PrimaryAppBar;
