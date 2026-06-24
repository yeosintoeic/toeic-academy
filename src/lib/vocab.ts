export interface VocabWord {
  english: string;
  korean: string;
  sentence: string;
}

import { vocabA } from "./vocab-a";
import { vocabB } from "./vocab-b";

export { vocabA, vocabB };

// 두 파일을 합쳐서 랜덤 출제에 사용합니다
export const vocab: VocabWord[] = [...vocabA, ...vocabB];
