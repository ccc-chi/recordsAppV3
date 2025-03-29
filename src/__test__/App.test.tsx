import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { Records } from "../domain/records";

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
    deleteRecords: jest.fn((id) => {
      recordsData.splice(
        recordsData.findIndex((record) => record.id === id),
        1
      );
      return Promise.resolve();
    }),
    updateRecords: jest.fn((id, title, time) => {
      const index = recordsData.findIndex((record) => record.id === id);
      if (index !== -1) {
        recordsData[index].title = title;
        recordsData[index].time = time;
      }
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
    const target = await screen.findByText(/登録テスト/);
    expect(target).toBeInTheDocument();
  });

  test("モーダルが新規登録というタイトルになっている", async () => {
    render(<App />);

    const user = userEvent.setup();
    const openModalButton = await screen.findByTestId("openModalButton");

    await user.click(openModalButton);
    const title = await screen.findByTestId("modalTitle");
    expect(title).toBeInTheDocument();
  });

  test("学習内容がないときに登録するとエラーがでる", async () => {
    render(<App />);

    const user = userEvent.setup();
    const openModalButton = await screen.findByTestId("openModalButton");
    await user.click(openModalButton);

    const button = await screen.findByTestId("addButton");

    await user.click(button);
    const error = await screen.findByTestId("titleError");
    expect(error).toBeInTheDocument();
  });

  test("学習時間がないときに登録するとエラーがでる：未入力のエラー", async () => {
    render(<App />);

    const user = userEvent.setup();
    const openModalButton = await screen.findByTestId("openModalButton");
    await user.click(openModalButton);

    const button = await screen.findByTestId("addButton");

    await user.click(button);
    const error = await screen.findByTestId("timeErrorRequired");
    expect(error).toBeInTheDocument();
  });

  test("学習時間がないときに登録するとエラーがでる：0以上でないときのエラー", async () => {
    render(<App />);

    const user = userEvent.setup();
    const openModalButton = await screen.findByTestId("openModalButton");
    await user.click(openModalButton);

    const time = await screen.findByTestId("timeInput");
    const button = await screen.findByTestId("addButton");

    await user.type(time, "0");
    await user.click(button);
    const error = await screen.findByTestId("timeErrorMin");
    expect(error).toBeInTheDocument();
  });

  test("削除ができること", async () => {
    render(<App />);

    const user = userEvent.setup();
    let initialCount = 0;

    await waitFor(() => {
      // 非同期の処理が終わってからリストの数を取得
      const listBody = screen.getByTestId("listBody");
      initialCount = listBody.querySelectorAll("li").length;
    });

    // 削除ボタンは複数あるので[0]で指定
    const buttons = await screen.findAllByTestId("deleteButton");
    await user.click(buttons[0]);

    await waitFor(() => {
      const updatedList = screen.getByTestId("listBody").querySelectorAll("li");
      expect(updatedList.length).toBe(initialCount - 1);
    });
  });

  test("モーダルのタイトルが記録編集である", async () => {
    render(<App />);

    const user = userEvent.setup();
    const buttons = await screen.findAllByTestId("editButton");
    await user.click(buttons[0]);

    const title = await screen.findByTestId("modalEditTitle");
    expect(title).toBeInTheDocument();
  });

  test("編集して登録すると更新される", async () => {
    render(<App />);

    const user = userEvent.setup();
    const buttons = await screen.findAllByTestId("editButton");
    await user.click(buttons[0]);

    const title = await screen.findByTestId("titleInput");
    const button = await screen.findByTestId("addEditButton");

    // 入力して登録
    await user.type(title, "編集して更新");
    await user.click(button);

    const target = await screen.findByText(/編集して更新/);
    expect(target).toBeInTheDocument();
  });
});
