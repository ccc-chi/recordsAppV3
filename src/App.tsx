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
  updateRecords,
} from "../utils/supabaseFunctions";

interface IFormInput {
  id: string;
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

  //-- 登録
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
    // データを追加
    await addRecords(data.title, data.time);
    const records = await getAllRecords();
    setRecords(records);
    // inputをリセット
    reset();
    // モーダルを閉じる
    addModal.onClose();
  };

  //-- 削除
  const onClickDeleteRecords = async (id: string) => {
    await deleteRecords(id);
    const records = await getAllRecords();
    setRecords(records);
  };

  //-- 編集
  const onClickEditRecords = async (id: string) => {
    const record = records.find((record) => record.id === id);
    if (!record) return;
    reset({ id: record.id, title: record.title, time: record.time });
    editModal.onOpen();
  };

  const onEditSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
    if (!data.id) {
      console.error("編集するIDがありません");
      return;
    }
    await updateRecords(data.id, data.title, data.time);
    const records = await getAllRecords();
    setRecords(records);
    // inputをリセット
    reset({ id: undefined, title: "", time: 0 });
    // モーダルを閉じる
    editModal.onClose();
  };

  //-- モーダル
  const addModal = useDisclosure();
  const editModal = useDisclosure();

  return (
    <>
      <div>
        <h1 data-testid="appTitle">学習記録アプリ</h1>
        <Button onClick={addModal.onOpen} data-testid="openModalButton">
          記録を追加する
        </Button>
        <Modal isOpen={addModal.isOpen} onClose={addModal.onClose}>
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
              <Button colorScheme="blue" mr={3} onClick={addModal.onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={editModal.isOpen} onClose={editModal.onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader data-testid="modalEditTitle">記録編集</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p>学習記録を編集する</p>
              <form onSubmit={handleSubmit(onEditSubmit)}>
                <Box>
                  <p>学習内容：</p>
                  <Input
                    type="text"
                    data-testid="titleEditInput"
                    {...register("title", {
                      required: "内容の入力は必須です",
                    })}
                    placeholder="学習内容を入力してください"
                  />
                  {errors.title && (
                    <span data-testid="titleEditError" style={{ color: "red" }}>
                      {errors.title.message}
                    </span>
                  )}
                </Box>
                <Box>
                  <p>学習時間：</p>
                  <Input
                    type="number"
                    data-testid="timeEditInput"
                    {...register("time", {
                      required: true,
                      min: 1,
                      max: 99,
                      valueAsNumber: true,
                    })}
                  />
                  {errors?.time?.type === "required" && (
                    <p
                      data-testid="timeEditErrorRequired"
                      style={{ color: "red" }}
                    >
                      時間の入力は必須です
                    </p>
                  )}
                  {errors?.time?.type === "min" && (
                    <p data-testid="timeEditErrorMin" style={{ color: "red" }}>
                      時間は0以上で入力してください
                    </p>
                  )}
                </Box>
                <Button type="submit" data-testid="addEditButton">
                  編集内容を登録
                </Button>
              </form>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  reset({ id: undefined, title: "", time: 0 });
                  editModal.onClose();
                }}
              >
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
                  <Button
                    data-testid="editButton"
                    onClick={() => onClickEditRecords(record.id)}
                  >
                    編集
                  </Button>
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
