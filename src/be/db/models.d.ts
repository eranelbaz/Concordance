export type Document = { id: string; path: string };
export type Word = { id: string; word: string };
export type Metadata = { id: string; name: string; value: string; documentId: string };
export type GroupTypes = 'regular' | 'phrase';
export type Group = { id: string; name: string; type: GroupTypes };
export type GroupToWords = { groupId: string; wordId: string; word: string; type: string; position: number };
export type WordToDocument = {
  id: string;
  word: string;
  wordId: string;
  lineIndex: number;
  wordIndex: number;
  paragraphIndex: number;
  paragraphLineIndex: number;
  documentId: string;
};
