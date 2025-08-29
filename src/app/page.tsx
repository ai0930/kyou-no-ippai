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
  IconButton,
} from "@mui/material";
import { drinks } from "./data";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useFavorites } from "./contexts/FavoritesContext";

export default function HomePage() {
  const [drinkLevel, setDrinkLevel] = useState("");
  const [taste, setTaste] = useState("");
  const [region, setRegion] = useState("");
  const [pairing, setPairing] = useState("");
  const [mood, setMood] = useState("");
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const router = useRouter();
  const [nav, setNav] = useState(0);
  const [expandedTaste, setExpandedTaste] = useState(false);
  const [expandedRegion, setExpandedRegion] = useState(false);
  const [expandedPairing, setExpandedPairing] = useState(false);
  const [expandedMood, setExpandedMood] = useState(false);

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
      {/* トップバー */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#FFAC62",
          "& .MuiToolbar-root": {
            color: "#fff",
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            今日の一杯
          </Typography>
        </Toolbar>
      </AppBar>

      {/* 今日のおすすめ（ランダム） */}
      <Card sx={{ m: 2, position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image={randomDrink.image}
          alt={randomDrink.name}
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
          onClick={() => toggleFavorite(randomDrink.name)}
        >
          {isFavorite(randomDrink.name) ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
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

      {/* 気分で探すセクション */}
      <Box
        sx={{
          m: 2,
          p: 3,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}
        >
          気分で探す
        </Typography>

        {/* 質問1: 酔いたい度 */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ color: "#000000", mb: 2, fontWeight: "medium" }}>
            今日はどのくらい酔いたいですか？
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {["ほんのり", "ほろ酔い", "しっかり"].map((level) => (
              <Button
                key={level}
                variant={drinkLevel === level ? "contained" : "outlined"}
                onClick={() => setDrinkLevel(level)}
                sx={{
                  backgroundColor:
                    drinkLevel === level ? "#FFAC62" : "transparent",
                  borderColor: drinkLevel === level ? "#FFAC62" : "#ddd",
                  color: drinkLevel === level ? "#fff" : "#959595",
                  "&:hover": {
                    backgroundColor:
                      drinkLevel === level ? "#FFAC62" : "#f5f5f5",
                    borderColor: drinkLevel === level ? "#FFAC62" : "#ddd",
                  },
                }}
              >
                {level}
              </Button>
            ))}
          </Box>
        </Box>

        {/* 質問2: 味の好み */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ color: "#000000", mb: 2, fontWeight: "medium" }}>
            どんな味が飲みたいですか？
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            {["さっぱり", "甘い", "苦い", "フルーティー", "コクがある"].map(
              (t) => (
                <Button
                  key={t}
                  variant={taste === t ? "contained" : "outlined"}
                  onClick={() => setTaste(t)}
                  sx={{
                    backgroundColor: taste === t ? "#FFAC62" : "transparent",
                    borderColor: taste === t ? "#FFAC62" : "#ddd",
                    color: taste === t ? "#fff" : "#959595",
                    "&:hover": {
                      backgroundColor: taste === t ? "#FFAC62" : "#f5f5f5",
                      borderColor: taste === t ? "#FFAC62" : "#ddd",
                    },
                  }}
                >
                  {t}
                </Button>
              )
            )}
            <Button
              variant="outlined"
              onClick={() => setExpandedTaste(!expandedTaste)}
              sx={{
                borderColor: "#FFAC62",
                color: "#FFAC62",
                minWidth: "40px",
                "&:hover": {
                  backgroundColor: "#FFF7E6",
                  borderColor: "#FFAC62",
                },
              }}
            >
              {expandedTaste ? "−" : "+"}
            </Button>
          </Box>
          {expandedTaste && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {[
                "スパイシー",
                "酸味",
                "塩味",
                "渋み",
                "香り高い",
                "まろやか",
              ].map((t) => (
                <Button
                  key={t}
                  variant={taste === t ? "contained" : "outlined"}
                  onClick={() => setTaste(t)}
                  sx={{
                    backgroundColor: taste === t ? "#FFAC62" : "transparent",
                    borderColor: taste === t ? "#FFAC62" : "#ddd",
                    color: taste === t ? "#fff" : "#959595",
                    "&:hover": {
                      backgroundColor: taste === t ? "#FFAC62" : "#f5f5f5",
                      borderColor: taste === t ? "#FFAC62" : "#ddd",
                    },
                  }}
                >
                  {t}
                </Button>
              ))}
            </Box>
          )}
        </Box>

        {/* 質問3: 地域 */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ color: "#000000", mb: 2, fontWeight: "medium" }}>
            どの地域のお酒が気になりますか？
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            {["日本", "北海道", "関東", "関西", "海外"].map((r) => (
              <Button
                key={r}
                variant={region === r ? "contained" : "outlined"}
                onClick={() => setRegion(r)}
                sx={{
                  backgroundColor: region === r ? "#FFAC62" : "transparent",
                  borderColor: region === r ? "#FFAC62" : "#ddd",
                  color: region === r ? "#fff" : "#959595",
                  "&:hover": {
                    backgroundColor: region === r ? "#FFAC62" : "#f5f5f5",
                    borderColor: region === r ? "#FFAC62" : "#ddd",
                  },
                }}
              >
                {r}
              </Button>
            ))}
            <Button
              variant="outlined"
              onClick={() => setExpandedRegion(!expandedRegion)}
              sx={{
                borderColor: "#FFAC62",
                color: "#FFAC62",
                minWidth: "40px",
                "&:hover": {
                  backgroundColor: "#FFF7E6",
                  borderColor: "#FFAC62",
                },
              }}
            >
              {expandedRegion ? "−" : "+"}
            </Button>
          </Box>
          {expandedRegion && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {[
                "東北",
                "中部",
                "中国",
                "四国",
                "九州",
                "沖縄",
                "ヨーロッパ",
                "アジア",
                "アメリカ",
              ].map((r) => (
                <Button
                  key={r}
                  variant={region === r ? "contained" : "outlined"}
                  onClick={() => setRegion(r)}
                  sx={{
                    backgroundColor: region === r ? "#FFAC62" : "transparent",
                    borderColor: region === r ? "#FFAC62" : "#ddd",
                    color: region === r ? "#fff" : "#959595",
                    "&:hover": {
                      backgroundColor: region === r ? "#FFAC62" : "#f5f5f5",
                      borderColor: region === r ? "#FFAC62" : "#ddd",
                    },
                  }}
                >
                  {r}
                </Button>
              ))}
            </Box>
          )}
        </Box>

        {/* 質問4: おつまみ・ペアリング */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ color: "#000000", mb: 2, fontWeight: "medium" }}>
            一緒に食べたいおつまみは？
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            {["唐揚げ", "枝豆", "チーズ", "サラダ", "デザート"].map((p) => (
              <Button
                key={p}
                variant={pairing === p ? "contained" : "outlined"}
                onClick={() => setPairing(p)}
                sx={{
                  backgroundColor: pairing === p ? "#FFAC62" : "transparent",
                  borderColor: pairing === p ? "#FFAC62" : "#ddd",
                  color: pairing === p ? "#fff" : "#959595",
                  "&:hover": {
                    backgroundColor: pairing === p ? "#FFAC62" : "#f5f5f5",
                    borderColor: pairing === p ? "#FFAC62" : "#ddd",
                  },
                }}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outlined"
              onClick={() => setExpandedPairing(!expandedPairing)}
              sx={{
                borderColor: "#FFAC62",
                color: "#FFAC62",
                minWidth: "40px",
                "&:hover": {
                  backgroundColor: "#FFF7E6",
                  borderColor: "#FFAC62",
                },
              }}
            >
              {expandedPairing ? "−" : "+"}
            </Button>
          </Box>
          {expandedPairing && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {[
                "刺身",
                "焼き鳥",
                "ナッツ",
                "オリーブ",
                "チョコレート",
                "フルーツ",
                "和菓子",
                "洋菓子",
              ].map((p) => (
                <Button
                  key={p}
                  variant={pairing === p ? "contained" : "outlined"}
                  onClick={() => setPairing(p)}
                  sx={{
                    backgroundColor: pairing === p ? "#FFAC62" : "transparent",
                    borderColor: pairing === p ? "#FFAC62" : "#ddd",
                    color: pairing === p ? "#fff" : "#959595",
                    "&:hover": {
                      backgroundColor: pairing === p ? "#FFAC62" : "#f5f5f5",
                      borderColor: pairing === p ? "#FFAC62" : "#ddd",
                    },
                  }}
                >
                  {p}
                </Button>
              ))}
            </Box>
          )}
        </Box>

        {/* 質問5: シーン・気分 */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ color: "#000000", mb: 2, fontWeight: "medium" }}>
            どんなシーン・気分で飲みたい？
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
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
                sx={{
                  backgroundColor: mood === m ? "#FFAC62" : "transparent",
                  borderColor: mood === m ? "#FFAC62" : "#ddd",
                  color: mood === m ? "#fff" : "#959595",
                  "&:hover": {
                    backgroundColor: mood === m ? "#FFAC62" : "#f5f5f5",
                    borderColor: mood === m ? "#FFAC62" : "#ddd",
                  },
                }}
              >
                {m}
              </Button>
            ))}
            <Button
              variant="outlined"
              onClick={() => setExpandedMood(!expandedMood)}
              sx={{
                borderColor: "#FFAC62",
                color: "#FFAC62",
                minWidth: "40px",
                "&:hover": {
                  backgroundColor: "#FFF7E6",
                  borderColor: "#FFAC62",
                },
              }}
            >
              {expandedMood ? "−" : "+"}
            </Button>
          </Box>
          {expandedMood && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {[
                "記念日",
                "一人の時間",
                "友達と",
                "家族と",
                "デート",
                "朝活",
                "夜更かし",
                "早起き",
              ].map((m) => (
                <Button
                  key={m}
                  variant={mood === m ? "contained" : "outlined"}
                  onClick={() => setMood(m)}
                  sx={{
                    backgroundColor: mood === m ? "#FFAC62" : "transparent",
                    borderColor: mood === m ? "#FFAC62" : "#ddd",
                    color: mood === m ? "#fff" : "#959595",
                    "&:hover": {
                      backgroundColor: mood === m ? "#FFAC62" : "#f5f5f5",
                      borderColor: mood === m ? "#FFAC62" : "#ddd",
                    },
                  }}
                >
                  {m}
                </Button>
              ))}
            </Box>
          )}
        </Box>

        {/* 結果へ */}
        <Box textAlign="center" sx={{ mt: 3 }}>
          <Button
            variant="contained"
            disabled={!drinkLevel}
            onClick={() => {
              const params = new URLSearchParams();
              if (drinkLevel) params.set("drinkLevel", drinkLevel);
              if (taste) params.set("taste", taste);
              if (region) params.set("region", region);
              if (pairing) params.set("pairing", pairing);
              if (mood) params.set("mood", mood);
              router.push(`/result?${params.toString()}`);
            }}
            sx={{
              backgroundColor: "#FFAC62",
              "&:hover": {
                backgroundColor: "#e6954f",
              },
              "&:disabled": {
                backgroundColor: "#ccc",
                color: "#666",
              },
            }}
          >
            おすすめを提案してもらう
          </Button>
        </Box>
      </Box>

      {/* フッター */}
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
