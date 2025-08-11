"use client";
import { useSelector, useDispatch } from "react-redux";

import { Button } from "@heroui/button";
import { decrement, increment } from "@/redux/features/counter/counterSlice";

export default function Home() {
  const count = useSelector((state: any) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <Button onPress={() => dispatch(increment())}>+</Button>
      <p>{count}</p>
      <Button onPress={() => dispatch(decrement())}>-</Button>


    </section>
  );
}
