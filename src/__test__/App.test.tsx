import "@testing-library/jest-dom";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { Records } from "../domain/records";

// const mockSpabase = jest
//   .fn()
//   .mockResolvedValue([
//     new Records("abc", "title1", 100),
//     new Records("def", "title2", 200),
//   ]);
// jest.mock("../../utils/supabaseFunctions", () => {
//   return {
//     getAllRecords: () => mockSpabase(),
//     addRecords: () => mockSpabase(),
//     deleteRecords: () => mockSpabase(),
//   };
// });

const recordsData: Records[] = [
  new Records("abc", "title1", 10),
  new Records("def", "title2", 20),
];
jest.mock("../../utils/supabaseFunctions", () => {
  return {
    getAllRecords: jest.fn(() => Promise.resolve([...recordsData])),
    addRecords: jest.fn((id, title, time) => {
      recordsData.push(new Records(id, title, time));
      return Promise.resolve();
    }),
  };
});

describe("AppTest", () => {
  test("タイトルがあること", async () => {
    render(<App />);
    const appTitle = await waitFor(() => screen.getByTestId("appTitle"));
    expect(appTitle).toBeInTheDocument();
  });

  test("ローディング画面をみることができる", async () => {
    render(<App />);
    expect(screen.getByText("loading...")).toBeInTheDocument();
  });

  test("テーブルをみることができる(リスト)", async () => {
    render(<App />);
    const listBody = await waitFor(() => screen.getByTestId("listBody"));
    const list = listBody.querySelectorAll("li");
    expect(list.length).toBe(2);
  });

  test("新規登録ボタンがある", async () => {
    render(<App />);
    const button = await waitFor(() => screen.getByTestId("openModalButton"));
    expect(button).toBeInTheDocument();
  });

  test("登録できること", async () => {
    render(<App />);

    const user = userEvent.setup();
    const openModalButton = await screen.findByTestId("openModalButton");
    await user.click(openModalButton);

    const title = await screen.findByTestId("titleInput");
    const time = await screen.findByTestId("timeInput");
    const button = await screen.findByTestId("addButton");

    // 入力して登録
    await user.type(title, "登録テスト");
    await user.type(time, "1");
    await user.click(button);

    // 登録されたことを確認
    await waitFor(() => {
      expect(screen.getByText(/登録テスト/)).toBeInTheDocument();
    });
  });
});
