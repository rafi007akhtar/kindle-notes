import { atom } from "jotai";
import { BookHighlights } from "../models/common.model";

export const fileContentsAtom = atom<string>();
export const bookTitlesAtom = atom<string[]>([]);
export const currentlyParsingAtom = atom<boolean>(false);
export const bookHighlightsAtom = atom<BookHighlights>({});
export const notesAtom = atom();
