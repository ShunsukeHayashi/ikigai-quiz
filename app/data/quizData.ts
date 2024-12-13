export interface Question {
  id: number;
  text: string;
  category: 'ikigaism' | 'regulations';
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export const questions: Question[] = [
  // Ikigaism Questions
  {
    id: 1,
    text: "Ikigaism「〇〇であれ」\n〇〇に当てはまるのは何？",
    category: "ikigaism",
    options: [
      "誠実",
      "真摯",
      "真面目",
      "論理的"
    ],
    correctAnswer: 1,
    explanation: "Ikigaismでは「誠実であれ」という基本原則があります。"
  },
  {
    id: 2,
    text: "Ikigaism「〇〇と向き合おう」\n〇〇に当てはまるのは何？",
    category: "ikigaism",
    options: [
      "感情",
      "数字",
      "時間",
      "人間関係"
    ],
    correctAnswer: 2,
    explanation: "Ikigaismでは「数字と向き合おう」という原則があります。"
  },
  {
    id: 3,
    text: "Ikigaism「主体性を持って〇〇しよう」\n〇〇に当てはまるのは何？",
    category: "ikigaism",
    options: [
      "実践",
      "学習",
      "行動",
      "挑戦"
    ],
    correctAnswer: 3,
    explanation: "主体性を持って「行動」することが重要です。"
  },
  {
    id: 4,
    text: "Ikigaism「気付き、学びをすぐ〇〇しよう」\n〇〇に当てはまるのは何？",
    category: "ikigaism",
    options: [
      "保存",
      "忘却",
      "分析",
      "アウトプット"
    ],
    correctAnswer: 4,
    explanation: "学びを「アウトプット」することで定着させます。"
  },
  {
    id: 5,
    text: "Ikigaism「〇〇でいよう」\n〇〇に当てはまるのは何？",
    category: "ikigaism",
    options: [
      "ネガティブ",
      "クリエイティブ",
      "ポジティブ",
      "アクティブ"
    ],
    correctAnswer: 3,
    explanation: "「ポジティブ」な姿勢を保つことが大切です。"
  },
  {
    id: 6,
    text: "Ikigaism「〇〇より量、量より速さ」\n〇〇に当てはまるのは何？",
    category: "ikigaism",
    options: [
      "質",
      "精度",
      "密度",
      "選択"
    ],
    correctAnswer: 1,
    explanation: "「質より量、量より速さ」という原則があります。"
  },
  {
    id: 7,
    text: "Ikigaism「〇〇しよう」\n〇〇に当てはまるのは何？",
    category: "ikigaism",
    options: [
      "新しいことにチャレンジ",
      "自分のできることを",
      "迷ったら安全な選択を",
      "無理を"
    ],
    correctAnswer: 1,
    explanation: "「新しいことにチャレンジ」することが成長につながります。"
  },
  {
    id: 8,
    text: "Ikigaism「〇〇を全うしよう」\n〇〇に当てはまるのは何？",
    category: "ikigaism",
    options: [
      "義務",
      "職務",
      "責務",
      "義務"
    ],
    correctAnswer: 3,
    explanation: "「責務を全うしよう」という原則があります。"
  },
  {
    id: 9,
    text: "Ikigaism「報連相より〇〇」\n〇〇に当てはまるのは何？",
    category: "ikigaism",
    options: [
      "相連報",
      "報相連",
      "連報相",
      "相報連"
    ],
    correctAnswer: 1,
    explanation: "「報連相より相連報」という原則があります。"
  },
  {
    id: 10,
    text: "Ikigaism「〇〇から逆算しよう」\n〇〇に当てはまるのは何？",
    category: "ikigaism",
    options: [
      "過去",
      "理想",
      "現在",
      "未来"
    ],
    correctAnswer: 4,
    explanation: "「未来から逆算しよう」という考え方を重視します。"
  },

  // Regulations Questions
  {
    id: 11,
    text: "AV新法は何のために立法された法律？（AV出演被害防止・救済法/AV新法）",
    category: "regulations",
    options: [
      "AVの制作費用の削減",
      "出演者の権利と安全を守る",
      "モザイクをかける基準を定める",
      "海外への配信を規制する"
    ],
    correctAnswer: 2,
    explanation: "AV新法は出演者の権利と安全を守るために制定されました。"
  },
  {
    id: 12,
    text: "モザイクをかける場所は?（刑法）",
    category: "regulations",
    options: [
      "乳首",
      "乳首と性器",
      "乳首と性器とア◯ル",
      "性器"
    ],
    correctAnswer: 4,
    explanation: "刑法に基づき、性器にモザイクをかける必要があります。"
  },
  {
    id: 13,
    text: "AV撮影は契約の締結と説明書の交付をしてから何日後に撮影ができる？（AV出演被害防止・救済法/AV新法）",
    category: "regulations",
    options: [
      "1週間",
      "1ヶ月",
      "3ヶ月",
      "6ヶ月"
    ],
    correctAnswer: 2,
    explanation: "契約締結から1ヶ月後に撮影が可能となります。"
  },
  {
    id: 14,
    text: "映像の公表は全ての撮影が終了してから〇ヶ月後でなければ公表できない？（AV出演被害防止・救済法/AV新法）",
    category: "regulations",
    options: [
      "1週間",
      "2ヶ月",
      "3ヶ月",
      "4ヶ月"
    ],
    correctAnswer: 4,
    explanation: "撮影終了から4ヶ月後に公表が可能となります。"
  },
  {
    id: 15,
    text: "猥褻物頒布等罪（刑法第175条）は何を禁止しているか？",
    category: "regulations",
    options: [
      "性的映像をインターネットにアップロードする行為",
      "モザイク処理をしない映像の販売",
      "公然と猥褻物を陳列、頒布、販売する行為",
      "成人指定商品を青少年に販売する行為"
    ],
    correctAnswer: 3,
    explanation: "刑法第175条は公然と猥褻物を陳列、頒布、販売する行為を禁止しています。"
  },
  {
    id: 16,
    text: "著作権法に違反する行為として正しいのはどれか？（著作権法）",
    category: "regulations",
    options: [
      "自身が制作した映像を第三者に無断で配信する行為",
      "クリエイターの許可を得て作品を共有する行為",
      "制作会社のロゴを映像に挿入する行為",
      "他者の映像作品を許可なくコピーし配信する行為"
    ],
    correctAnswer: 4,
    explanation: "著作権法では、他者の作品を無断でコピー・配信することを禁止しています。"
  },
  {
    id: 17,
    text: "映像作品にモザイクをかける基準を定めている法律はどれか？（刑法）",
    category: "regulations",
    options: [
      "著作権法",
      "AV出演被害防止・救済法",
      "刑法第175条",
      "青少年保護育成条例"
    ],
    correctAnswer: 3,
    explanation: "刑法第175条がモザイクの基準を定めています。"
  },
  {
    id: 18,
    text: "青少年保護育成条例において、成人指定商品の広告規制に関する条項として正しいものはどれか？（青少年保護育成条例）",
    category: "regulations",
    options: [
      "店舗内のみの広告表示が許可されている",
      "15歳以上の青少年には広告表示可能",
      "テレビやラジオでの広告は禁止されていない",
      "インターネット広告は特に規制されていない"
    ],
    correctAnswer: 1,
    explanation: "青少年保護育成条例では、店舗内のみの広告表示が許可されています。"
  }
];
