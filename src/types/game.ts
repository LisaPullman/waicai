export interface GameState {
  currentWord: string;
  aiGuess: string;
  isGuessing: boolean;
  score: number;
  round: number;
  gameStatus: 'waiting' | 'drawing' | 'guessing' | 'result';
}

export interface GuessResponse {
  guess: string;
  confidence: string;
}

export const WORDS = [
  '苹果', '香蕉', '橙子', '汽车', '飞机', '房子', '树木', '花朵',
  '太阳', '月亮', '星星', '小猫', '小狗', '鱼儿', '鸟儿', '蝴蝶',
  '椅子', '桌子', '书本', '铅笔', '手机', '电脑', '电视', '钟表',
  '雨伞', '鞋子', '帽子', '手套', '杯子', '盘子', '勺子', '叉子'
];