"use client";
import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { drinks, Drink } from "../data";
import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  BottomNavigation,
  BottomNavigationAction,
  IconButton,
} from "@mui/material";
// CardMedia,
import Image from "next/image";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useFavorites } from "../contexts/FavoritesContext";

type Filters = {
  drinkLevel?: string;
  taste?: string;
  region?: string;
  pairing?: string;
  mood?: string;
};

// AI風マッチング: 同義語・関連語を軽く吸収し、加重スコアを算出
const tasteSynonyms: Record<string, string[]> = {
  さっぱり: ["爽快", "クリア", "すっきり"],
  甘い: ["甘酸っぱい", "スイート"],
  苦い: ["ビター", "ホップの苦味"],
  フルーティー: ["果実味", "トロピカル", "香り高い"],
  コクがある: ["濃厚", "リッチ"],
};
const moodSynonyms: Record<string, string[]> = {
  仕事終わり: ["仕事帰り", "リフレッシュ"],
  リラックス: ["ほっと", "一息"],
  パーティー: ["イベント", "盛り上がる"],
  語りたい夜: ["落ち着いて", "大人の夜"],
  休日昼間: ["昼", "ブランチ"],
};

function includesWithSynonyms(
  text: string,
  key?: string,
  map?: Record<string, string[]>
): boolean {
  if (!key) return true;
  if (text.includes(key)) return true;
  const syns = map?.[key] ?? [];
  return syns.some((s) => text.includes(s));
}

function alcoholMatches(level?: string, alc?: number): boolean {
  if (!level || alc == null) return true;
  if (level === "ほんのり") return alc <= 6;
  if (level === "ほろ酔い") return alc > 5 && alc <= 9;
  if (level === "しっかり") return alc >= 9;
  return true;
}

function aiScore(drink: Drink, filters: Filters): number {
  let score = 0;
  if (
    filters.taste &&
    includesWithSynonyms(drink.taste, filters.taste, tasteSynonyms)
  )
    score += 3;
  if (filters.region && drink.region.includes(filters.region)) score += 2;
  if (filters.pairing && drink.pairing.includes(filters.pairing)) score += 3;
  if (
    filters.mood &&
    includesWithSynonyms(drink.mood, filters.mood, moodSynonyms)
  )
    score += 3;
  if (filters.drinkLevel && alcoholMatches(filters.drinkLevel, drink.alcohol))
    score += 4;
  return score;
}

export default function ResultPage() {
  const search = useSearchParams();
  const router = useRouter();
  const [nav, setNav] = useState(0);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const filters: Filters = useMemo(
    () => ({
      drinkLevel: search.get("drinkLevel") || undefined,
      taste: search.get("taste") || undefined,
      region: search.get("region") || undefined,
      pairing: search.get("pairing") || undefined,
      mood: search.get("mood") || undefined,
    }),
    [search]
  );

  const recommendations = useMemo(() => {
    // 1) 厳密に近い高スコア順
    const scored = drinks
      .map((d) => ({ drink: d, score: aiScore(d, filters) }))
      .filter((x) => x.score > 0);

    if (scored.length > 0) {
      return scored
        .sort((a, b) => b.score - a.score || b.drink.year - a.drink.year)
        .map((s) => s.drink)
        .slice(0, 12);
    }

    // 2) 段階的緩和: ドリンクレベル以外でtaste/mood/region/pairingのどれか部分一致
    const relaxed = drinks.filter(
      (d) =>
        includesWithSynonyms(d.taste, filters.taste, tasteSynonyms) ||
        d.region.includes(filters.region ?? "") ||
        d.pairing.includes(filters.pairing ?? "") ||
        includesWithSynonyms(d.mood, filters.mood, moodSynonyms)
    );
    if (relaxed.length > 0) {
      return relaxed.sort((a, b) => b.year - a.year).slice(0, 12);
    }

    // 3) 最終フォールバック: 年新しい順
    return [...drinks].sort((a, b) => b.year - a.year).slice(0, 12);
  }, [filters]);

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
            おすすめ結果
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ m: 2 }}>
        <Typography variant="subtitle1">あなたの条件</Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
          {Object.entries(filters)
            .filter(([, v]) => Boolean(v))
            .map(([k, v]) => (
              <Chip key={k} label={`${k}: ${v}`} />
            ))}
        </Box>
      </Box>

      <Box sx={{ m: 2, display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
        {recommendations.length === 0 && (
          <Box textAlign="center" sx={{ color: "text.secondary", py: 8 }}>
            <Typography variant="body1">
              条件に当てはまるお酒が見つかりませんでした。
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              条件を少し緩めて再検索してみてください。
            </Typography>
            <Button
              sx={{ mt: 2 }}
              variant="outlined"
              onClick={() => router.push("/")}
            >
              条件を変更
            </Button>
          </Box>
        )}
        {recommendations.map((d) => (
          <Card key={d.name} sx={{ position: "relative" }}>
            <Box
              sx={{ width: 400, height: 200, position: "relative", mx: "auto" }}
            >
              <Image
                src={d.image}
                alt={d.name}
                width={400}
                height={200}
                style={{ objectFit: "cover", borderRadius: 8 }}
                priority={true}
              />
            </Box>
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
              onClick={() => toggleFavorite(d.name)}
            >
              {isFavorite(d.name) ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <CardContent>
              <Typography variant="h6">{d.name}</Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {d.type} / アルコール{d.alcohol}%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {d.description}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                <Chip size="small" label={`味: ${d.taste}`} />
                <Chip size="small" label={`地域: ${d.region}`} />
                <Chip size="small" label={`ペアリング: ${d.pairing}`} />
                <Chip size="small" label={`気分: ${d.mood}`} />
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => router.push("/")}>
                条件を変更
              </Button>
            </CardActions>
          </Card>
        ))}
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
