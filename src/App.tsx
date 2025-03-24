import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Box,
} from "@chakra-ui/react";

import { Records } from "./domain/records";
import {
  addRecords,
  getAllRecords,
  deleteRecords,
} from "../utils/supabaseFunctions";

interface IFormInput {
  title: string;
  time: number;
}

function App() {
  const [records, setRecords] = useState<Records[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  //-- 学習データをフェッチ
  useEffect(() => {
    const getRecords = async () => {
      const data = await getAllRecords();
      setRecords(data);
      setLoading(false);
    };
    getRecords();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>();

  //-- 登録ボタンをクリック
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
    // データを追加
    await addRecords(data.title, data.time);
    const records = await getAllRecords();
    setRecords(records);
    // inputをリセット
    reset();
    // モーダルを閉じる
    onClose();
  };

  const onClickDeleteRecords = async (id: string) => {
    await deleteRecords(id);
    const records = await getAllRecords();
    setRecords(records);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <div>
        <h1 data-testid="appTitle">学習記録アプリ</h1>
        <Button onClick={onOpen} data-testid="openModalButton">
          記録を追加する
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader data-testid="modalTitle">新規登録</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p>学習記録を登録する</p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box>
                  <p>学習内容：</p>
                  <Input
                    type="text"
                    data-testid="titleInput"
                    {...register("title", { required: "内容の入力は必須です" })}
                    placeholder="学習内容を入力してください"
                  />
                  {errors.title && (
                    <span data-testid="titleError" style={{ color: "red" }}>
                      {errors.title.message}
                    </span>
                  )}
                </Box>
                <Box>
                  <p>学習時間：</p>
                  <Input
                    type="number"
                    data-testid="timeInput"
                    {...register("time", {
                      required: true,
                      min: 1,
                      max: 99,
                      valueAsNumber: true,
                    })}
                  />
                  {errors?.time?.type === "required" && (
                    <p data-testid="timeErrorRequired" style={{ color: "red" }}>
                      時間の入力は必須です
                    </p>
                  )}
                  {errors?.time?.type === "min" && (
                    <p data-testid="timeErrorMin" style={{ color: "red" }}>
                      時間は0以上で入力してください
                    </p>
                  )}
                </Box>
                <Button type="submit" data-testid="addButton">
                  登録
                </Button>
              </form>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {loading ? (
          <p data-testid="loading">loading...</p>
        ) : (
          <ul data-testid="listBody">
            {records.map((record) => (
              <li key={record.id}>
                <Box m={2}>
                  <p>
                    {record.title} {record.time}
                  </p>
                  <Button
                    data-testid="deleteButton"
                    onClick={() => onClickDeleteRecords(record.id)}
                  >
                    削除
                  </Button>
                  {record.id}
                </Box>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default App;
