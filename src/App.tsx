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
import { addRecords, getAllRecords } from "../utils/supabaseFunctions";

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

  //-- 学習記録を登録
  const [title, setTitle] = useState<string>("");
  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const [time, setTime] = useState<number>(0);
  useEffect(() => {}, []);
  const onChangeTime = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTime(Number(e.target.value));
  const onClickAdd = async () => {
    // supabaseに追加
    await addRecords(title, time);
    // リストに追加
    const records = await getAllRecords();
    setRecords(records);
    // inputをリセット
    setTitle("");
    setTime(0);
  };

  //-- バリデーション
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
    // await addRecords(data.title, data.time);
    // // リストに追加
    // const records = await getAllRecords();
    // setRecords(records);
    // // inputをリセット
    // setTitle("");
    // setTime(0);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <div>
        <h1>Vite</h1>
        <Button onClick={onOpen}>登録</Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>STUDY RECORD</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p>学習記録を登録する</p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box>
                  <p>学習内容：</p>
                  <Input
                    type="text"
                    {...register("title", { required: "必須入力" })}
                    onChange={onChangeTitle}
                    placeholder="学習内容を入力してください"
                  />
                  {errors?.title?.type === "required" && (
                    <p>内容の入力は必須です</p>
                  )}
                </Box>
                <Box>
                  <p>学習時間：</p>
                  <Input
                    type="number"
                    {...register("time", {
                      required: "必須入力",
                      min: 18,
                      max: 99,
                    })}
                    onChange={onChangeTime}
                  />
                  {errors?.time?.type === "required" && (
                    <p>時間の入力は必須です</p>
                  )}
                </Box>
                <Button type="submit" onClick={onClickAdd}>
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
        <ul>
          {loading ? (
            <p>loading...</p>
          ) : (
            records.map((record) => (
              <li key={record.id}>
                {record.title} {record.time}
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
}

export default App;
