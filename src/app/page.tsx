"use client";
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Box,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [drinkLevel, setDrinkLevel] = useState("");
  const router = useRouter();
  const [nav, setNav] = useState(0);

  // フッターのページ遷移
  const handleNav = (event: React.SyntheticEvent, newValue: number) => {
    setNav(newValue);
    switch (newValue) {
      case 0:
        router.push("/");
        break;
      case 1:
        router.push("/history");
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
      {/* トップバー */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            今日の一杯
          </Typography>
        </Toolbar>
      </AppBar>

      {/* 今日のおすすめ */}
      <Card sx={{ m: 2 }}>
        <CardMedia
          component="img"
          height="200"
          image="/sample-drink.jpg"
          alt="今日の一杯"
        />
        <CardContent>
          <Typography variant="h6">サンセット・クーラー</Typography>
          <Typography variant="body2">
            カクテル / アルコール5% <br />
            オレンジとソーダの甘酸っぱい味わいでリフレッシュ。
          </Typography>
        </CardContent>
      </Card>

      {/* 気分で探す */}
      <Box sx={{ m: 2 }}>
        <Typography>今日はどのくらい酔いたいですか？</Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          {["ほんのり", "ほろ酔い", "しっかり"].map((level) => (
            <Button
              key={level}
              variant={drinkLevel === level ? "contained" : "outlined"}
              onClick={() => setDrinkLevel(level)}
            >
              {level}
            </Button>
          ))}
        </Box>
      </Box>

      {/* 結果へ */}
      <Box textAlign="center" sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="warning"
          disabled={!drinkLevel}
          onClick={() => router.push("/result")}
        >
          おすすめを提案してもらう
        </Button>
      </Box>

      {/* フッター */}
      <BottomNavigation
        showLabels
        sx={{ position: "fixed", bottom: 0, width: "100%", zIndex: 1000 }}
        value={nav}
        onChange={handleNav}
      >
        <BottomNavigationAction label="ホーム" icon={<HomeIcon />} />
        <BottomNavigationAction label="履歴" icon={<HistoryIcon />} />
        <BottomNavigationAction label="マイページ" icon={<PersonIcon />} />
        <BottomNavigationAction label="設定" icon={<SettingsIcon />} />
      </BottomNavigation>
    </Box>
  );
}
