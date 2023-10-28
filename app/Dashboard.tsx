"use client";
import Image from "next/image";

import type { RootState } from "./GlobalRedux/store";
import { useSelector, useDispatch } from "react-redux";
import {
  increment,
  decrement,
  incrementByAmount,
} from "./GlobalRedux/feature/counter/counterSlice";

export default function Dashboard() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <main className="min-h-screen bg-gray-300 flex flex-col justify-center items-center gap-4">
      <button
        className="bg-blue-500 p-2 rounded-lg"
        onClick={() => dispatch(increment())}
      >
        Increment
      </button>
      <span>{count}</span>
      <button
        className="bg-red-600 p-2 rounded-lg"
        onClick={() => dispatch(decrement())}
      >
        Decrement
      </button>

      <div>
        <button
          className="bg-yellow-400 p-2 rounded-lg"
          onClick={() => dispatch(incrementByAmount(2))}
        >
          Increment by 2
        </button>
      </div>
    </main>
  );
}
