import { useForm } from "react-hook-form";

type FormValues = {
  name: string;
  email: string;
};

export const Form = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p>
        名前：
        <input type="text" {...register("name", { required: "名前は必須です" })} />
        {errors.name && <span style={{ color: "red" }}>{errors.name.message}</span>}
      </p>
      <p>
        メールアドレス：
        <input type="text" {...register("email", { required: true })} />
        {errors?.email?.type === "required" && <p style={{ color: "red" }}>メールアドレスは必須です</p>}
      </p>
      <button type="submit">登録</button>
    </form>
  );
};