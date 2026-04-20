import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

/* ===============================
   DISPATCH HOOK (typed)
================================ */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/* ===============================
   SELECTOR HOOK (typed)
================================ */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;