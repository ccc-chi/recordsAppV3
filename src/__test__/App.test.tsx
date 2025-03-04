import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import App from "../App";

// createClient関数をモック
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
      insert: jest.fn().mockResolvedValue({ error: null }),
      delete: jest.fn().mockResolvedValue({ data: [], error: null }),
      eq: jest.fn().mockReturnThis(),
  })),
}));

describe("サンプルテスト", () => {
  test("[正常系]サンプルテスト", async () => {
    // 実行
    render(<App />);

    // 検証
    expect(screen.getByText("Vite")).toBeInTheDocument();
  });
});
