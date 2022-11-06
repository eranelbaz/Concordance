export type Document = { id: string; path: string };
export type Word = { id: string; word: string };
export type Metadata = { id: string; name: string; value: string; documentId: string };
export type WordToDocument = {
  id: string;
  word: string;
  wordId: string;
  lineIndex: number;
  wordIndex: number;
  paragraphIndex: number;
  documentId: string;
};
