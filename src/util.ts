import * as shogi from "shogi-lib";

export function pieceToKIF(piece: shogi.Piece.Piece) {
  // prettier-ignore
  switch (piece) {
    case "P":
    case "p": return "歩";
    case "L":
    case "l": return "香";
    case "N":
    case "n": return "桂";
    case "S":
    case "s": return "銀";
    case "G":
    case "g": return "金";
    case "B":
    case "b": return "角";
    case "R":
    case "r": return "飛";
    case "K":
    case "k": return "玉";
    case "+P":
    case "+p": return "と";
    case "+L":
    case "+l": return "杏";
    case "+N":
    case "+n": return "圭";
    case "+S":
    case "+s": return "全";
    case "+B":
    case "+b": return "馬";
    case "+R":
    case "+r": return "竜";
  }
}

// 適当
export function numToKanji(n: number): string {
  const kanji = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
  if (n <= 10) {
    return kanji[n];
  }
  return kanji[10] + kanji[n % 10];
}
