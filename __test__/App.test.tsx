import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import App from "../App";

describe("サンプルテスト", () => {
  test("[正常系]サンプルテスト", async () => {
    // 実行
    render(<App />);

    // 検証
    expect(screen.getByText("Vite")).toBeInTheDocument();
  });
});
