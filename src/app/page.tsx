"use client";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState, useMemo } from "react";
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
import { drinks } from "./data";
import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";
import styles from "./page.module.css";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const [drinkLevel, setDrinkLevel] = useState("");
  const [taste, setTaste] = useState("");
  const [region, setRegion] = useState("");
  const [pairing, setPairing] = useState("");
  const [mood, setMood] = useState("");
  const router = useRouter();
  const [nav, setNav] = useState(0);
  // ランダムで1件選ぶ（初回マウント時のみ）
  const randomDrink = useMemo(
    () => drinks[Math.floor(Math.random() * drinks.length)],
    []
  );

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
      <AppBar
        position="static"
        sx={{ backgroundColor: "#ff7300", color: "#fff" }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            今日の一杯
          </Typography>
        </Toolbar>
      </AppBar>

      {/* 今日のおすすめ（ランダム） */}
      <Card sx={{ m: 2 }}>
        <CardMedia
          component="img"
          height="200"
          image={randomDrink.image}
          alt={randomDrink.name}
        />
        <CardContent>
          <Typography variant="h6" className={styles.name}>
            {randomDrink.name}
          </Typography>
          <Typography variant="body2" className={styles.carddis}>
            {randomDrink.type} / アルコール{randomDrink.alcohol} <br />
          </Typography>
          <Typography variant="body2" className={styles.features}>
            {randomDrink.description}
          </Typography>
        </CardContent>
      </Card>

      {/* 気分で探す（質問1: 酔いたい度） */}
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

      {/* 質問2: 味の好み */}
      <Box sx={{ m: 2 }}>
        <Typography>どんな味が飲みたいですか？</Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
          {["さっぱり", "甘い", "苦い", "フルーティー", "コクがある"].map(
            (t) => (
              <Button
                key={t}
                variant={taste === t ? "contained" : "outlined"}
                onClick={() => setTaste(t)}
              >
                {t}
              </Button>
            )
          )}
        </Box>
      </Box>

      {/* 質問3: 地域 */}
      <Box sx={{ m: 2 }}>
        <Typography>どの地域のお酒が気になりますか？</Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
          {["日本", "北海道", "関東", "関西", "海外"].map((r) => (
            <Button
              key={r}
              variant={region === r ? "contained" : "outlined"}
              onClick={() => setRegion(r)}
            >
              {r}
            </Button>
          ))}
        </Box>
      </Box>

      {/* 質問4: おつまみ・ペアリング */}
      <Box sx={{ m: 2 }}>
        <Typography>一緒に食べたいおつまみは？</Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
          {["唐揚げ", "枝豆", "チーズ", "サラダ", "デザート"].map((p) => (
            <Button
              key={p}
              variant={pairing === p ? "contained" : "outlined"}
              onClick={() => setPairing(p)}
            >
              {p}
            </Button>
          ))}
        </Box>
      </Box>

      {/* 質問5: シーン・気分 */}
      <Box sx={{ m: 2 }}>
        <Typography>どんなシーン・気分で飲みたい？</Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
          {[
            "仕事終わり",
            "リラックス",
            "パーティー",
            "語りたい夜",
            "休日昼間",
          ].map((m) => (
            <Button
              key={m}
              variant={mood === m ? "contained" : "outlined"}
              onClick={() => setMood(m)}
            >
              {m}
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
