export type DocumentMetadata = {
  author: string;
  title: string;
  album: string;
  year: string;
};

export type InputDocument = DocumentMetadata & { content: string };
