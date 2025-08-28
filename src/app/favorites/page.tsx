"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { drinks, Drink } from "../data";
import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  BottomNavigation,
  BottomNavigationAction,
  IconButton,
  Typography as MuiTypography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useFavorites } from "../contexts/FavoritesContext";

export default function FavoritesPage() {
  const router = useRouter();
  const [nav, setNav] = useState(0);
  const { favorites, removeFavorite } = useFavorites();

  const favoriteDrinks = drinks.filter((drink) =>
    favorites.includes(drink.name)
  );

  const handleNav = (event: React.SyntheticEvent, newValue: number) => {
    setNav(newValue);
    switch (newValue) {
      case 0:
        router.push("/");
        break;
      case 1:
        router.push("/favorites");
        break;
      case 2:
        router.push("/mypage");
        break;
      case 3:
        router.push("/settings");
        break;
    }
  };

  return (
    <Box pb={7}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            お気に入り
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ m: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          お気に入りのお酒 ({favoriteDrinks.length}件)
        </Typography>

        {favoriteDrinks.length === 0 ? (
          <Box textAlign="center" sx={{ color: "text.secondary", py: 8 }}>
            <MuiTypography variant="body1">
              まだお気に入りがありません
            </MuiTypography>
            <MuiTypography variant="body2" sx={{ mt: 1 }}>
              ホーム画面や結果画面でハートマークをタップしてお気に入りに追加してください
            </MuiTypography>
            <Button
              sx={{ mt: 2 }}
              variant="contained"
              onClick={() => router.push("/")}
            >
              ホームに戻る
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
            {favoriteDrinks.map((d) => (
              <Card key={d.name} sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={d.image}
                  alt={d.name}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://via.placeholder.com/400x200?text=No+Image";
                  }}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    },
                  }}
                  onClick={() => removeFavorite(d.name)}
                >
                  <FavoriteIcon color="error" />
                </IconButton>
                <CardContent>
                  <Typography variant="h6">{d.name}</Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {d.type} / アルコール{d.alcohol}%
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {d.description}
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}
                  >
                    <Chip size="small" label={`味: ${d.taste}`} />
                    <Chip size="small" label={`地域: ${d.region}`} />
                    <Chip size="small" label={`ペアリング: ${d.pairing}`} />
                    <Chip size="small" label={`気分: ${d.mood}`} />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => router.push("/")}>
                    ホームに戻る
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      <BottomNavigation
        showLabels
        sx={{ position: "fixed", bottom: 0, width: "100%", zIndex: 1000 }}
        value={nav}
        onChange={handleNav}
      >
        <BottomNavigationAction label="ホーム" icon={<HomeIcon />} />
        <BottomNavigationAction label="お気に入り" icon={<FavoriteIcon />} />
        <BottomNavigationAction label="マイページ" icon={<PersonIcon />} />
        <BottomNavigationAction label="設定" icon={<SettingsIcon />} />
      </BottomNavigation>
    </Box>
  );
}
